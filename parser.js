const EventEmitter = require('events');
const fs = require("fs");
const handlebars = require("handlebars");
const slug = require('slug');
const HandlebarsWrapper = require('./handlebarswrapper');

class Parser extends EventEmitter {
  constructor(path) {
    super();
    if(!fs.existsSync(path)) {
      throw new Error("Invalid path, unable to read templates");
    }

    this._templates = {};
    this._queue = [];
    this._list = [];
    this._tags = {};
    this._handlebars = new HandlebarsWrapper(path);
  
    this.parsePost = this.parsePost.bind(this);
    this._parseNext = this._parseNext.bind(this);

    this._handlebars.on('templateLoaded', this._parseNext);
    this.on("htmlReady", this._parseNext);
  }

  parsePost(data) {
    data.type = "post";
    data.slug = slug(data.title, {lower: true});
    this._queue.push(data);
    this._addToList(data);
    this._parseNext();
  }


  _addToList(data) {
    let listData = { id: data.id, title: data.title, slug: data.slug, image: data.image, data: data.date};
    this._list.push(listData);
    this._queue.push({
      type: "home",
      title: "homepage",
      slug: "index",
      items: this._list.reverse()
    });

    data.tags.forEach(tag => {
      if(this._tags[tag]) {
        this._tags[tag].push(listData);
      } else {
        this._tags[tag] = [listData];
      }
    });
  }

  _parseNext() {
    if(this._queue.length > 0) {
      var data = this._queue.pop();
      if(!this._handlebars.isTemplateLoaded(data.type)) {
        this._queue.push(data);
        this._handlebars.loadTemplate(data.type);
      } else {
        var html = this._handlebars.parse(data);
        var filename = data.slug+'.html';
        this.emit('htmlReady', filename, html);
      }
    }
  }

}

module.exports = Parser;
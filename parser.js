const EventEmitter = require('events');
const fs = require("fs");
const handlebars = require("handlebars");
const slug = require('slug')

class Parser extends EventEmitter {
  constructor(templatedir) {
    super();
    this.templatedir = templatedir;
    this._templates = {};
    this._queue = [];
    this._list = [];
    this.parsePost = this.parsePost.bind(this);
    this.on("templateLoaded", this._parseNext)
    this.on("htmlReady", this._parseNext)
  }

  parsePost(data) {
    data.type = "post";
    this._queue.push(data);
    this._addToList(data);
    this._parseNext();
    
  }

  _loadTemplate(name) {
    fs.readFile(this.templatedir+name+".html", 'utf-8', (error, data) => {
      if(error) {
        this.emit('error', error);
      } else {
        this._templates[name] = handlebars.compile(data);
        this.emit('templateLoaded');
      }
    });
  }

  _addToList(data) {
    this._list.push({ id: data.id, title: data.title, image: data.image, data: data.date});
    this._queue.push({
      type: "list",
      title: "list",
      items: this._list
    });

  }

  _parseNext() {
    if(this._queue.length > 0) {
      var data = this._queue.pop();
      if(!this._templates[data.type]) {
        this._queue.push(data);
        this._loadTemplate(data.type);
      } else {
        var html = this._templates[data.type](data);
        var filename = slug(data.title, {lower: true})+'.html';
        this.emit('htmlReady', filename, html);
      }
    }
  }

}

module.exports = Parser;
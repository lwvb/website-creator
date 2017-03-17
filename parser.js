const EventEmitter = require('events');
const fs = require("fs");
const handlebars = require("handlebars");
const slug = require('slug')

class Parser extends EventEmitter {
  constructor(templatedir) {
    super();
    this.templatedir = templatedir;
    this.templates = {};
    this.queue = [];
    this.list = [];
    this.parsePost = this.parsePost.bind(this);
    this.on("templateLoaded", this.parseNext)
    this.on("newContent", this.parseNext)
  }

  loadTemplate(name) {
    fs.readFile(this.templatedir+name+".html", 'utf-8', (error, data) => {
      if(error) {
        this.emit('error', error);
      } else {
        this.templates[name] = handlebars.compile(data);
        this.emit('templateLoaded');
      }
    });
  }

  parsePost(data) {
    data.type = "post";
    this.queue.push(data);
    this.addToList(data);
    this.parseNext();
    
  }

  addToList(data) {
    this.list.push({ id: data.id, title: data.title, image: data.image, data: data.date});
    this.queue.push({
      type: "list",
      title: "list",
      items: this.list
    });

  }

  parseNext() {
    if(this.queue.length > 0) {
      var data = this.queue.pop();
      if(!this.templates[data.type]) {
        this.queue.push(data);
        this.loadTemplate(data.type);
      } else {
        var html = this.templates[data.type](data);
        var filename = slug(data.title, {lower: true})+'.html';
        this.emit('newContent', filename, html);
      }
    }
  }

}

module.exports = Parser;
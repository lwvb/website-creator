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
    this.parse = this.parse.bind(this);
    this.on("templateLoaded", this.parseNext)
    this.on("ready", this.parseNext)
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

  parse(data) {
    this.queue.push(data);
    this.parseNext();
  }

  parseNext() {
    if(this.queue.length > 0) {
      var data = this.queue.pop();
      if(!this.templates[data.type]) {
        this.loadTemplate(data.type);
        this.queue.push(data);
      } else {
        var html = this.templates[data.type](data);
        var filename = slug(data.title, {lower: true})+'.html';
        this.emit('ready', filename, html);
      }
    }
  }

}

module.exports = Parser;
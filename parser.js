const EventEmitter = require('events');
const fs = require("fs");
const handlebars = require("handlebars");

class Parser extends EventEmitter {
  constructor() {
    super();
    this.parse = this.parse.bind(this);
  }

  init() {
    fs.readFile('./resources/template.html', 'utf-8', (error, data) => {
      if(error) {
        this.emit('error', error);
      } else {
        this.template = handlebars.compile(data);
        this.emit('initReady');
      }
    });
  }

  parse(data) {
    var template = this.template;
    var html = template(data);
    this.emit('ready', html);
  }

}

module.exports = Parser;
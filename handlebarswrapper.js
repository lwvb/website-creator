const EventEmitter = require('events');
const fs = require("fs");
const handlebars = require("handlebars");

class HandlebarsWrapper extends EventEmitter {
  constructor(path) {
    super();
    if(!fs.existsSync(path)) {
      throw new Error("Invalid path, unable to read templates");
    }
    this._templatedir = path;
    this._layout;
    //handlebars.registerPartials(path + '/partials');

    this._templates = {};
  }

  _loadLayout(callback) {
    fs.readFile(this._templatedir+"_layout.html", 'utf-8', (error, data) => {
      if(error) {
        this.emit('error', error);
      } else {
        this._layout = handlebars.compile(data);
        this.emit('layoutLoaded');
        callback();
      }
    });
  }

  loadTemplate(name) {
    if(this._layout === undefined) {
      this._loadLayout(() => { this.loadTemplate(name); });
      return;
    }
    fs.readFile(this._templatedir+name+".html", 'utf-8', (error, data) => {
      if(error) {
        this.emit('error', error);
      } else {
        this._templates[name] = handlebars.compile(data);
        this.emit('templateLoaded');
      }
    });
  }

  isTemplateLoaded(name) {
    return this._templates[name];
  }


  parse(data) {
    if(!this._templates[data.type]) {
      throw new Error('template not loaded');
    } else {
      data.content = this._templates[data.type](data);
      return this._layout(data);
    }
  }

}

module.exports = HandlebarsWrapper;
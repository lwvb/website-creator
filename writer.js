const EventEmitter = require('events');
const fs = require("fs");

class Reader extends EventEmitter {
  constructor() {
    super(); //must call super for "this" to be defined.
  }

  write(filepath, content) {
    fs.writeFile(filepath, content, (error) => {
      if (error) {
        this.emit('error', error);
      } else {
        this.emit('ready');
      }
    });
  }

}

module.exports = Reader;
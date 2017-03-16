const EventEmitter = require('events');
const fs = require("fs");

class Reader extends EventEmitter {
  constructor(filename) {
    super();
    this.filename = filename;
    this.write = this.write.bind(this);
  }

  write(content) {
    fs.writeFile(this.filename, content, (error) => {
      if (error) {
        this.emit('error', error);
      } else {
        this.emit('ready');
      }
    });
  }

}

module.exports = Reader;
const EventEmitter = require('events');
const fs = require("fs");

class Reader extends EventEmitter {
  constructor(dir) {
    super();
    this.dir = dir;
    this.write = this.write.bind(this);
  }

  write(filename, content) {
    fs.writeFile(this.dir+filename, content, (error) => {
      if (error) {
        this.emit('error', error);
      } else {
        this.emit('fileSaved', filename);
      }
    });
  }

}

module.exports = Reader;
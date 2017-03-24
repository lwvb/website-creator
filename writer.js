const EventEmitter = require('events');
const fs = require("fs");

class Reader extends EventEmitter {
  constructor(path) {
    super();
    if(!fs.existsSync(path)) {
      throw new Error("Invalid path, unable to write");
    }
    this._path = path;
    this.write = this.write.bind(this);
  }

  write(filename, content) {
    fs.writeFile(this._path+filename, content, (error) => {
      if (error) {
        this.emit('error', error);
      } else {
        this.emit('fileSaved', filename);
      }
    });
  }

}

module.exports = Reader;
const EventEmitter = require('events');
const fs = require("fs");

class Reader extends EventEmitter {
  constructor(path) {
    super();
    this._path = path;
    if(!fs.existsSync(path)) {
      throw new Error("Invalid path, unable to read");
    }
    this.read = this.read.bind(this);
    this.watch = this.watch.bind(this);
  }

  read() {
    fs.readdir(this._path, (error, files) => {
      if (error) {
        this.emit('error', error);
      } else {
        this._readFileList(files);
      }
    })
  }

  watch() {
    fs.watch(this._path, (eventType, filename) => {
      // every event is also a change
      // this doesn't watch deletes at the moment !!!
      if(eventType == 'change') {
        if (filename) {
          this._readJsonFile(filename);
        } else {
          read();
        }
      }
    });
  }

  _isJsonFile(filename) {
    return filename.endsWith(".json");
  }

  _readFileList(files){
    var jsonfiles = files.filter(this._isJsonFile);
    jsonfiles.forEach(file => {
      this._readJsonFile(file);
    });
  }

  _readJsonFile(file){
    var filepath = this._path + file;
    fs.readFile(filepath, 'utf8',  (error, data) => {
      if (error) {
        this.emit('error', error);
      } else {
        var jsonContent = JSON.parse(data);
        this.emit('newPost', jsonContent);
      }
    });
  }

}

module.exports = Reader;
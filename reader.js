const EventEmitter = require('events');
const fs = require("fs");

class Reader extends EventEmitter {
  constructor() {
    super();
    this.readDir = this.readDir.bind(this);
  }

  readDir(path) {
    fs.readdir(path, (error, files) => {
      if (error) {
        this.emit('error', error);
      } else {
        this._readFileList(files, path);
      }
    })
  }

  _isJsonFile(filename) {
    return filename.endsWith(".json");
  }

  _readFileList(files, path){
    var jsonfiles = files.filter(this._isJsonFile);
    jsonfiles.forEach(file => {
      this._readJsonFile(path + file);
    });
  }

  _readJsonFile(filepath){
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
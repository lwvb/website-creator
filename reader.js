const EventEmitter = require('events');
const fs = require("fs");

class Reader extends EventEmitter {
  constructor() {
    super(); //must call super for "this" to be defined.
  }

  readDir(path) {
    fs.readdir(path, (error, files) => {
      if (error) {
        this.emit('error', error);
      } else {
        this.readFileList(files, path);
      }
    })
  }

  isJsonFile(filename) {
    return filename.endsWith(".json");
  }

  readFileList(files, path){
    var jsonfiles = files.filter(this.isJsonFile);
    jsonfiles.forEach(file => {
      this.readJsonFile(path + file);
    });
  }

  readJsonFile(filepath){
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
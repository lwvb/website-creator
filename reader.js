const EventEmitter = require('events');
const fs = require("fs");

class Reader extends EventEmitter {
  constructor() {
    super(); //must call super for "this" to be defined.
  }

  readJsonFile(filepath){
    fs.readFile(filepath, 'utf8',  (error, data) => {
      if (error) {
        this.emit('error', error);
      } else {
        var jsonContent = JSON.parse(data);
        this.emit('ready', jsonContent);
      }
    });
  }

}

module.exports = Reader;
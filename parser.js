const EventEmitter = require('events');

class Parser extends EventEmitter {
  constructor() {
    super(); //must call super for "this" to be defined.
  }

  parse(data) {
    var html = '<html><head><title>'+data.title+'</title></head><body><h1>'+data.title+'</h1><p>'+data.content+'</body></html>';
    this.emit('ready', html);
  }

}

module.exports = Parser;
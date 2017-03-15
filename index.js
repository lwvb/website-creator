'use strict';

const program = require('commander');
const fs = require("fs");

program
  .version('0.0.1')
  .option('-d, --sourcedir <required>','Directory with source files')
  .option('-o, --outputdir <required>','Where the output is stored (default to "dist")')
  .action()
  .parse(process.argv); // end with parse to parse through the input

var sourcedir = program.sourcedir || './src';
var outputdir = program.outputdir || './dist';
console.log('Transformm from %s to %s', sourcedir, outputdir);

var readJsonFile = (filepath, succesCallback) => {
  fs.readFile(filepath, 'utf8',  (error, data) => {
    if (error) {
      throw error;
    } else {
      var jsonContent = JSON.parse(data);
      succesCallback(jsonContent);
    }
  });
}

var writeHtmlFile = (filepath, content, succesCallback) => {
  fs.writeFile(filepath, content, (error) => {
    if (error) {
      throw error;
    } else {
      succesCallback();
    }
  });
}

readJsonFile(sourcedir+'/test.json', (data) => {
  console.log("title:", data.title);
  writeHtmlFile(outputdir+'/test.html', '<html><head><title>'+data.title+'</title></head><body><h1>'+data.title+'</h1></body></html>', () => {})
})


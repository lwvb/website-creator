#!/usr/bin/env node
'use strict';

const program = require('commander');
const fs = require("fs");
const Reader = require("./reader");
const Parser = require("./parser");
const Writer = require("./writer");

program
  .version('0.0.1')
  .option('-d, --sourcedir <required>','Directory with source files')
  .option('-t, --templatedir <required>','Directory with template files')
  .option('-o, --outputdir <required>','Where the output is stored (default to "dist")')
  .option('-w, --watch', 'Watch to input for changes')
  .action()
  .parse(process.argv); // end with parse to parse through the input

var sourcedir = program.sourcedir || './data/';
var templatedir = program.templatedir ||'./src/templates/';
var outputdir = program.outputdir || './dist/';
console.log('Transform from %s to %s', sourcedir, outputdir);



var reader = new Reader(sourcedir);
var parser = new Parser(templatedir);
var writer = new Writer(outputdir);

reader.on('newPost', parser.parsePost);
parser.on('htmlReady', writer.write);
writer.on('fileSaved', (filename) => {
  console.log('File saved to disk: ' + filename);
});


reader.read();
if(program.watch) {
  reader.watch()
}



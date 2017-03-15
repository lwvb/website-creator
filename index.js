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
  .option('-o, --outputdir <required>','Where the output is stored (default to "dist")')
  .action()
  .parse(process.argv); // end with parse to parse through the input

var sourcedir = program.sourcedir || './src';
var outputdir = program.outputdir || './dist';
console.log('Transformm from %s to %s', sourcedir, outputdir);


var reader = new Reader();
var parser = new Parser();
var writer = new Writer();

reader.on('ready', (data) => {
  parser.parse(data);
});

parser.on('ready', (data) => {
  writer.write(outputdir+'/test.html', data)
})

writer.on('ready', () => {
  console.log('ready');
})

reader.readJsonFile(sourcedir+'/test.json');


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

var sourcedir = program.sourcedir || './resources/data/';
var templatedir = './resources/templates/';
var outputdir = program.outputdir || './dist/';
console.log('Transformm from %s to %s', sourcedir, outputdir);



var reader = new Reader();
var parser = new Parser(templatedir);
var writer = new Writer(outputdir);

reader.on('ready', parser.parse);
parser.on('ready', writer.write);
writer.on('ready', () => {
  console.log('ready');
});

reader.readDir(sourcedir);



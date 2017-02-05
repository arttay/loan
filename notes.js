"use strict";

const request 	= require('request');
const fs 		= require("fs");
const csv 		= require('fast-csv');
const noteService = require("./services/NotesService");

let counter = 0;
let isReading = false;

request
  .get('https://resources.lendingclub.com/SecondaryMarketAllNotes.csv')
  .on('error', function(err) {
    console.log(err)
  })
  .on('end', function(response) {
		noteService.determineGoodLoans();
  })
  .pipe(fs.createWriteStream('notes.csv'))






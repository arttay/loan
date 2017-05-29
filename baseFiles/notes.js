"use strict";
const request 		= require('request');
const fs 			= require("fs");
const csv 			= require('fast-csv');
const noteService 	= require("../services/NotesService");

/*
setInterval(function () {
	//notes are updated every 5 min
	//Every 5 min, grab the csv and start processing
	console.log("Starting process")
  	noteService.getNotes();
}, 300000)
*/

let notes = function () {};

notes.prototype.startNotes = function () {
	noteService.getNotes();
}


module.exports = new notes();
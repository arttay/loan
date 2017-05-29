"use strict";
const request 		= require('request');
const fs 			= require("fs");
const csv 			= require('fast-csv');
const noteService 	= require("../services/NotesService");

let notes = function () {};

notes.prototype.startNotes = function () {
	noteService.getNotes().then(() => {
		//restart parsing notes once the previous loop ends
		this.startNotes();
	});
}


module.exports = new notes();
"use strict";
const loans = require("./baseFiles/loans");
const notes = require("./baseFiles/notes");
const argv = require('yargs').argv;

if (argv.type === "loans") {
	loans.startLoans();
} else if (argv.type === "notes") {
	notes.startNotes();
} else {
	loans.startLoans();
}

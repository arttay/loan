"use strict";
let Stream 		= require('stream');
let ReadSteram 	= require('stream').Readable;
const csv 		= require('fast-csv');
const fs 		= require("fs");
const rules 	= require("../data/notesRules.json").rules;
const request 	= require('request');

module.exports = {
	getNotes: function () {
		request
		  .get('https://resources.lendingclub.com/SecondaryMarketAllNotes.csv')
		  .on('error', function(err) {
		    console.log(err)
		  })
		  .on('end', () => {
		  	this.determineGoodLoans();
		  })
		  .pipe(fs.createWriteStream('notes.csv'))
	},

	determineGoodLoans: function () {
		this.parseCsv();
	},

	parseCsv: function () {
			let stream  = fs.createReadStream("notes.csv");
			let dataArr = [];
			let self = this;

			let csvStream = csv()
			    .on("data", (data) => {
			        let obj = {
			        	LoanId: data[0],
			        	NoteId: data[1],
			        	OrderId: data[2],
			        	OutstandingPrincipal: data[3],
			        	AccruedInterest: data[4],
			        	Status: data[5],
			        	AskPrice: data[6],
			        	Markup_Discount: data[7],
			        	YTM: data[8],
			        	DaysSinceLastPayment: data[9],
			        	CreditScoreTrend: data[10],
			        	FICO_End_Range: data[11],
			        	Date_Time_Listed: data[12],
			        	NeverLate: data[13],
			        	Loan_Class: data[14],
			        	Loan_Maturity: data[15],
			        	Original_Note_Amount: data[16],
			        	Interest_Rate: data[17],
			        	Remaining_Payments: data[18],
			        	Principal_plus_Interest: data[19],
			        	Application_Type: data[20]
			        }
			        this.runRules(obj);
			    })
			    .on("done", () => {
			    	console.log("This round done")
			    })

			stream.pipe(csvStream);
	},
	runRules: function (obj) {
		if (obj.Application_Type.toLowerCase() === "joint") {
			if (parseInt(obj.Markup_Discount) < -5) {
				///todo: run a process after each rule to check if everything is true. This will speed up the program by not having to continue to run process for rule that wont pass.
				let foo = rules.reduce((prev, item) => {
					if (Array.isArray(item.value)) if (!this.processArray(item, obj)) prev = false;
					if (typeof item.value === "string") if (!this.processString(item, obj)) prev = false;
					
					return prev;
				}, true);

				if (foo) {
					console.log(obj)
				}

			}
		}
	},

	processString: function (rule, obj) {
		let flag = false;

		if (rule.type === "match") {
			if (rule.value === obj[rule.name].toLowerCase()) flag = true;
		}
		return flag;
	},

	processArray: function (rule, obj) {
		return rule.value.reduce((prev, item) => {
			if (rule.type === "match") if (obj[rule.name] === item) prev = true;
			
			return prev;
		}, false);
		
	}
}
"use strict";
//todo: figure out how to use es6 modules in node
//http://stackoverflow.com/questions/36901147/es2015-import-not-working-in-node-v6-0-0-with-with-harmony-modules-option
const csv 			= require('fast-csv');
const csvParser 	= require('csv-string');
const fs 			= require("fs");
const mongoService 	= require("./MongoService");
const rules 		= require("../data/notesRules.json").rules;
const request 		= require('request');
const StringDecoder = require('string_decoder').StringDecoder;
const decoder 		= new StringDecoder('utf8');
const http 			= require("http");
const config 		= require("../config");
const url 			= "https://resources.lendingclub.com/SecondaryMarketAllNotes.csv";

const API_KEY		= config.apiKey;
const ACCOUNT_KEY	= config.accountKey;

module.exports = {
	parsedCsvString: "",
	getNotes: function () {
		return new Promise((resolve, reject) => {
			console.log("start")
			request({
				method: "GET",
				uri: "https://api.lendingclub.com/api/investor/v1/secondarymarket/listings",
				headers: {
					"Accept": "text/csv",
					"Authorization": "0fw08C2fnWtjoXjmllBZ4SAKUUg=",
					"X-LC-LISTING-VERSION": 1.3
				}
			})
			.on("data", (data) => {
				this.readStream(decoder.write(data))
			})
			.on('end', (a) => {
			  	console.log("end");
			  	resolve();
			})



			/*
			request
			  .get('https://api.lendingclub.com/api/investor/v1/secondarymarket/listings', {
			  	headers: {
			  		"Accept": "text/csv"
			  	}
			  })
			  .on('error', function(err) {
			    console.log(err)
			  })
			  .on("data", (data) => {
			  	this.readStream(decoder.write(data))
			  })
			  .on('end', (a) => {
			  	console.log("end");
			  	resolve();
			  })
		*/
		});
	},

	determineGoodLoans: function () {
		this.parseCsv();
	},

	readStream: function (csvString) {
		let reg = /\n$/;
		//console.log(csvString)

		/*
			Sometimes the csv string ends in the middle of the string
			We check for an end of line(which should be an end of csv string)
			We keep building the string until we get to an end of line from
			the string.
		*/

		if (!reg.test(csvString)) {
			this.setCsvString(csvString);
		} else {
			this.setCsvString(csvString);
			let foo = this.getCsvString();
			this.parseCsv(foo)
			this.clearCsvString();
		}
	},

	parseCsv: function (csvString) {
		let foo = csvParser.parse(csvString);
		foo.forEach((data) => {
			let obj = {
			    LoanId: data[0],
			    NoteId: data[1],
			    outstandingPrincipal: data[2],
			    accruedInterest: data[3],
			    loanStatus: data[4],
			    price: data[5],
			    markupOrDiscount: data[6],
			    yieldToMaturity: data[7],
			    daysSinceLastPayment: data[8],
			    creditScoreTrend: data[9],
			    ficoEndRangeHigh: data[10],
			    ficoEndRangeLow: data[11],
			    listingStartDate: data[12],
			    expirationDate: data[13],
			    isNeverLate: data[14],
			    subGrade: data[15],
			    term: data[16],
			    originalNoteAmount: data[17],
			    interestRate: data[18],
			    remainingPayments: data[19],
			    applicationType: data[20],
			}
			this.runRules(obj);
		});
	},
	runRules: function (obj) {
			if (parseFloat(obj.price) < 0.5) {
				console.log(obj)
				this.buy()
			}
			/*
			if (parseInt(obj.markupOrDiscount) < -5) { //todo: move this to rules json
				///todo: run a process after each rule to check if everything is true. This will speed up the program by not having to continue to run process for rule that wont pass.
				let foo = rules.reduce((prev, item) => {
					if (Array.isArray(item.value)) if (!this.processArray(item, obj)) prev = false;
					if (typeof item.value === "string") if (!this.processString(item, obj)) prev = false;
					
					return prev;
				}, true);
			
			//	console.log(obj.AskPrice)
				if (parseFloat(obj.price) < 0.5) {
					console.log(obj)
					//this.buy()
				}

				if (foo) {
					//console.log(obj)
					//only look for loans where the owner has a credit scroe of >700
					if (obj.FICO_End_Range.match(/^[6-9][7-9][0-9]+(-[0-9]+)+$/gm) !== null) {
						//console.log(obj)
						this.logNote(obj)
						//this.buy(obj);
					}
				}
			}
			*/
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
	},

	buy: function (data) {
		console.log("buying")
		const buyJson = {
			"noteId": "40940144",
			"price": 0.5,
			"orderType": "BUY",
			"expirationDate": "2018-04-14"
		}
		
		request({
			url: `https://api.lendingclub.com/api/investor/v1/secondarymarket/accounts/${ACCOUNT_KEY}/orders`,
			method: "POST",
			headers: {
				"Content-type": "application/json",
				"Accept": "application/json",
				"Authorization": API_KEY,
				"X-LC-LISTING-VERSION": 1.3
			},
			body: JSON.stringify(buyJson)
		}, (err, resp, body) => {
	
		})
		
		
	},
	getCsvString: function () {
		return this.parsedCsvString;
	},

	setCsvString: function (newString) {
		this.parsedCsvString += newString;
	},

	clearCsvString: function () {
		this.parsedCsvString = "";
	},

	logNote: function (obj) {
		let loanId = obj.LoanId;
		mongoService.findNote(loanId).then((data) => {
			data ? this.increaseCount(obj) : this.insertNewNote(obj);
		})
	},
	increaseCount: function (obj) {
		mongoService.getData(obj.LoanId).then((data) => {
			data.count++;
			mongoService.updateNote(data, data.LoanId);
		})
	},

	insertNewNote: function (obj) {
		obj.count = 1;
		mongoService.insertNote(obj)
	}
}
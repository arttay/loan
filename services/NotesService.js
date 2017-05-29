"use strict";
//todo: figure out how to use es6 modules in node
//http://stackoverflow.com/questions/36901147/es2015-import-not-working-in-node-v6-0-0-with-with-harmony-modules-option
const csv 			= require('fast-csv');
const csvParser 	= require('csv-string');
const fs 			= require("fs");
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
		request
		  .get('https://resources.lendingclub.com/SecondaryMarketAllNotes.csv')
		  .on('error', function(err) {
		    console.log(err)
		  })
		  .on("data", (data) => {
		  	this.readStream(decoder.write(data))
		  })
		  .on('end', () => {
		  	console.log("end")
		  })
	},

	determineGoodLoans: function () {
		this.parseCsv();
	},

	readStream: function (csvString) {
		let reg = /\n$/;

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
		});
	},

	runRules: function (obj) {
		if (obj.Application_Type.toLowerCase() === "joint") {
			if (parseInt(obj.Markup_Discount) < -5) { //todo: move this to rules json
				///todo: run a process after each rule to check if everything is true. This will speed up the program by not having to continue to run process for rule that wont pass.
				let foo = rules.reduce((prev, item) => {
					if (Array.isArray(item.value)) if (!this.processArray(item, obj)) prev = false;
					if (typeof item.value === "string") if (!this.processString(item, obj)) prev = false;
					
					return prev;
				}, true);
		
			//console.log(obj);
				if (foo) {
					//only look for loans where the owner has a credit scroe of >700
					if (obj.FICO_End_Range.match(/^[7-9][0-9][0-9]+(-[0-9]+)+$/gm) !== null) {
						console.log(obj)
						//this.buy(obj);
					}
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
	},
	buy: function (data) {
		let foo = {
			"aid": parseInt(ACCOUNT_KEY),
			"notes": [{
				"loanId": parseInt(data.LoanId),
				"orderId": parseInt(data.OrderId),
				"noteId": parseInt(data.NoteId),
				"bidPrice": parseFloat(data.AskPrice)
			}]
		} 


		
		request({
			url: `https://api.lendingclub.com/api/investor/v1/accounts/${ACCOUNT_KEY}/trades/buy/`,
			method: "POST",
			headers: {
				"Content-type": "application/json",
				"Accept": "application/json",
				"Authorization": API_KEY,
				"X-LC-LISTING-VERSION": 1.1
			},
			body: JSON.stringify(foo)
		}, (err, resp, body) => {
			console.log({
				body: body,
				err: err,
			})
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
	}
}
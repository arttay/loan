"use strict";
const request = require('request');
const config = require("../config");
const service = require("../services/loanService");
const buyService = require("../services/buyService");

const API_KEY = config.apiKey;
const ACCOUNT_KEY = config.accountKey;

let loanService = function () {};

loanService.prototype.startLoans = function () {
	console.log("start")
	let ops = getOps();
	service.getLoans(ops).then(() => {
	//	this.startLoans();
	});
}

function getLoanUrls () {
	return {
		listing: 'https://api.lendingclub.com/api/investor/v1/loans/listing?showAll=true',
		folio: `https://api.lendingclub.com/api/investor/v1/accounts/${ACCOUNT_KEY}/trades/buy/`
	}
}

function getOps () {
	return {
		url: getLoanUrls().listing,
		headers: {
			"Content-type": "application/json",
			"Accept": "application/json",
			"Authorization": API_KEY,
			"X-LC-LISTING-VERSION": 1.3
		}
	}
}

module.exports = new loanService();

















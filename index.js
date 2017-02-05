"use strict";
const request = require('request');
const config = require("./config");
const service = require("./loanService");
const buyService = require("./services/buyService");


const API_KEY = config.apiKey;
const ACCOUNT_KEY = config.accountKey;

let urls = {
	listing: 'https://api.lendingclub.com/api/investor/v1/loans/listing?showAll=true',
	folio: `https://api.lendingclub.com/api/investor/v1/accounts/${ACCOUNT_KEY}/trades/buy/`
}
//https://resources.lendingclub.com/SecondaryMarketAllNotes.csv

let ops = {
	url: urls.listing,
	headers: {
		"Content-type": "application/json",
		"Accept": "application/json",
		"Authorization": API_KEY,
		"X-LC-LISTING-VERSION": 1.1
	}
}

request(ops, (err, resp, body) => {

	service.parseLoan(JSON.parse(body));
	
	/*
	buyService.getCash().then((data) => {
		console.log(data)
	});
	buyService.buy(94342189);
	*/

})
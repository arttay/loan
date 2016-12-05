"use strict";
const request = require('request');
const config = require("./config");
const service = require("./loanService");

const API_KEY = config.apiKey;
const ACCOUNT_KEY = config.accountKey;

let urls = {
	listing: 'https://api.lendingclub.com/api/investor/v1/loans/listing?showAll=true'
}


let ops = {
	url: urls.listing,
	headers: {
		"Content-type": "application/json",
		"Accept": "application/json",
		"Authorization": API_KEY
	}
}

request(ops, (err, resp, body) => {
	
			service.parseLoan(JSON.parse(body));
			
})
"use strict";
const request = require('request');
const config = require("../config")



module.exports = {
	getCash: function () {
		let url = `https://api.lendingclub.com/api/investor/v1/accounts/${config.accountKey}/availablecash`;
		let ops = {
			url: url,
			headers: {
				"Content-type": "application/json",
				"Accept": "application/json",
				"Authorization": config.apiKey
			}
		}
		return new Promise((resolve, reject) => {
			request(ops, (err, resp, body) => {
				resolve(JSON.parse(body).availableCash);
			});
		});

	},
	buy: function (loanId) {
		let url = `https://api.lendingclub.com/api/investor/v1/accounts/${config.accountKey}/orders`;

		let postData = {
			aid: config.accountKey,
			orders: [{
				loanId: loanId,
				requestedAmount: 25
			}]

		}

		let ops = {
			url: url,
			method: "POST",
			body: JSON.stringify(postData),
			headers: {
				"Content-type": "application/json",
				"Accept": "application/json",
				"Authorization": config.apiKey
			}
		}
		return new Promise((resolve, reject) => {
			request(ops, (err, resp, body) => {
				console.log({
					err: err,
					body: body
				});
				//resolve(JSON.parse(body).availableCash);
			});
		});

	}
}

//
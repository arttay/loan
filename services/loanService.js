"use strict";
const rules = require("../data/loanRules");
const request = require('request');
const mongoService = require("./MongoService");

module.exports = {
	getLoans: function (ops) {
		return new Promise((resolve, reject) => {
			request(ops, (err, resp, body) => {
				if (body !== "" && body !== "Internal Server Error" && body !== "Too Many Requests") {
					this.parseLoan(JSON.parse(body)).then(() => {
						console.log("done")
						resolve();
					});
				
				}

			});
		});
	},

	parseLoan: function (obj) {
		let arr = obj.loans;
		let len = arr.length;
		let criticals = rules.critical;
		let secondary = rules.secondary;

		return new Promise((resolve, reject) => {
			arr.forEach((item, key, index) => {
				let criticalHits = 0;
				let criticalRules = 3;
				let secondaryHits = 0;
				let secondaryRules = 6;
				
				for (let rule in criticals) {
					if (Array.isArray(criticals[rule])) {
						criticals[rule].forEach((ruleItem) => { if (item[rule] === ruleItem) criticalHits += 1; })
					} else {
						if (item[rule] ===  criticals[rule]) criticalHits += 1;
					}
				}
				let criticalRulePercent = (criticalHits / criticalRules) * 100;

				if (criticalRulePercent === 100) {
						for (var key in secondary) {
							let type = secondary[key].type;
							let value = secondary[key].value;

							if (type === "less") {
								if(item[key] < value) {
									secondaryHits += 1;
								}
							} 
							
							if (type === "greater") {
								if(item[key] > value) {
									secondaryHits += 1;
								}
							} 
							
							if (type === "match") {
								if (Array.isArray(value)) {
									value.forEach((value) => {
										if (item[key] === value) secondaryHits += 1;
									});
								} else {
									if (item[key] === value) {
										secondaryHits += 1;
									}
								}
							}//end match if
						}
						//console.log(item)
						//console.log("\n")
						if (secondaryHits >= 19) {
								/*
								Stuff to still create rules for

									bcOpenToBuy: 			Total open to buy on revolving bankcards.
									mthsSinceLastRecord: 	The Number of months since the last public record.
									mthsSinceRecentInq: 	Months since most recent inquiry.
									totalBalExMort: 		Total credit balance excluding mortgage.
									mthsSinceRecentBcDlq: 	Months since most recent bankcard delinquency.
									totHiCredLim: 			Total high credit/credit limit
									totCurBal: 				Total current balance of all accounts
									avgCurBal: 				Average current balance of all accounts
									numBcSats: 				Number of satisfactory bankcard accounts
									numTl120dpd2m: 			Number of accounts currently 120 days past due (updated in past 2 months)
									inqFi: 					Number of personal finance inquiries.
									inqLast12m: 			Number of credit inquiries in past 12 months.
								*/
								//console.log(item)
							mongoService.find(item.id).then((status) => {
								if (!status) {
									mongoService.insert(item.id)
								}
							})
						}
				}

				if (key === len-1) {
					//if its the last item in the array, resolve the promise, end it.
					resolve();
				}
			});
		})

	}
}
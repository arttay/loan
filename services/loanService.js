"use strict";
const rules = require("../data/loanRules");
const request = require('request');
const mongoService = require("./MongoService");

module.exports = {
	getLoans: function (ops) {
		return new Promise((resolve, reject) => {
			request(ops, (err, resp, body) => {
				this.parseLoan(JSON.parse(body)).then(() => {
					console.log("done")
					resolve();
				})
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
				let criticalRules = 2;
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


				if (criticalRulePercent > 80) {
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
									bcOpenToBuy
									mthsSinceLastRecord
									mthsSinceRecentInq
									totalBalExMort
									mthsSinceRecentBcDlq
									totHiCredLim
									totCurBal
									avgCurBal
									numBcSats
									numTl120dpd2m
									inqFi
									inqLast12m

								*/
								console.log(item)
							mongoService.find(item.id).then((status) => {
								if (!status) {
									mongoService.insert(item.id)
								}
							})
						}
				}

				if (key === len-1) {
					resolve();
				}
			});
		})

	}
}
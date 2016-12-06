"use strict";
const rules = require("./rules")
const mongoService = require("./services/MongoService");

module.exports = {
	parseLoan: function (obj) {
		let arr = obj.loans;
		let criticals = rules.critical;
		let secondary = rules.secondary;

		let loanArr = [94140399];
		

		arr.forEach((item) => {
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
						//console.log(loanArr[94140399])

						mongoService.connect();
						}
					}
				}
			}
		});
	}
}
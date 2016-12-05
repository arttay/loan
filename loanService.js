"use strict";
const rules = require("./rules")

module.exports = {
	parseLoan: function (obj) {
		let arr = obj.loans;
		let criticals = rules.critical;
		let secondary_numeral = rules.secondary.numeral;
		

		arr.forEach((item) => {
			let criticalHits = 0;
			let criticalRules = 2;
			let secondaryHits = 0;
			let secondaryRules = 2;
			
			for (let rule in criticals) {
				if (Array.isArray(criticals[rule])) {
					criticals[rule].forEach((ruleItem) => { if (item[rule] === ruleItem) criticalHits += 1; })
				} else {
					if (item[rule] ===  criticals[rule]) criticalHits += 1;
				}
				
				let criticalRulePercent = (criticalHits / criticalRules) * 100;

				if (criticalRulePercent > 80) {
					for (var key in secondary_numeral) {
						console.log(secondary_numeral[key], key)
					}
					//console.log("yep", item.grade)
				}
			}
		});
	}
}
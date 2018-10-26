"use strict";
const rules = require("../data/loanRules");
const request = require('request');
const mongoService = require("./MongoService");
const buyService = require("./buyService");
const config = require("../config")



module.exports = {
	getLoans: function (ops) {
		return new Promise((resolve, reject) => {
			request(ops, (err, resp, body) => {
				if (body !== "" && body !== "Internal Server Error" && body !== "Too Many Requests") {
					this.parseLoan(JSON.parse(body)).then((data) => {
						
						resolve(data);
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
		let numOfCritRules = Object.keys(criticals).length;
		let numOfSecondRules = Object.keys(secondary).length;

		return new Promise((resolve, reject) => {
			
			let criticalFilteredLoans = arr.reduce((prev, item) => {
				let rulesPassed = 0;
				for (let rule in criticals) {
					if (runRules(item, criticals[rule], rule)) rulesPassed++;
				}
				if (rulesPassed === (numOfCritRules - 1)) prev.push(item)
				return prev;
			}, []);


			let furtherFilteredLoans = criticalFilteredLoans.reduce((prev, item) => {
				let rulesPassed = 0;

				for (let rule in secondary) {
					if (runRules(item, secondary[rule], rule)) rulesPassed++;
				}

				if (rulesPassed >= (numOfSecondRules - 2)) {
					let json = {
						id: item.id,
						term: item.term,
						grade: item.subGrade,
						intRate: item.intRate,
						expDefaultRate: item.expDefaultRate,
						dti: item.dti,
						annualInc: item.annualInc,
						isIncV: item.isIncV,
						revolUtil: item.revolUtil,
						revolBalc: item.revolBal,
						ficoRangeHigh: item.ficoRangeHigh
					}
					prev.push(item)
					
				}

				return prev;
			}, []);

			resolve(furtherFilteredLoans)
		})

	}
}

function checkOwnership (loanId) {

	return new Promise((resolve, reject) => {
		let url = `https://api.lendingclub.com/api/investor/v1/accounts/${config.accountKey}/notes`;
		let ops = {
			url: url,
			method: "GET",
			headers: {
				"Content-type": "application/json",
				"Accept": "application/json",
				"Authorization": config.apiKey
			}
		}
		return new Promise((resolve, reject) => {
			request(ops, (err, resp, body) => {
				const notes = JSON.parse(body).myNotes

				const doOwnNote = notes.reduce((prev, item) => {
					if (item.loanId === loanId) prev = true
					return prev
				}, false)
				resolve(doOwnNote)
			});
		});
	})

}

function runRules (item, rule, prop) {
	let positiveCount = 0;
	let returnValue = false;

	if (rule.type === "depMatch") {
		if (runDepMatch(item, rule, prop)) returnValue = true;
	}

	if (rule.type === "match") {
		if (runMatch(item, rule, prop)) returnValue = true;
	}

	if (rule.type === "less") {
		if (runLess(item, rule, prop)) returnValue = true;
	}

	if (rule.type === "greater") {
		if (runGreater(item, rule, prop)) returnValue = true;
	}

	return returnValue;
}

function runMatch (item, rule, prop) {
	let returnValue = false;
	let value = rule.value;

	if (Array.isArray(value)) {
		returnValue = value.reduce((prev, v) => {
			if (item[prop] === v) prev = true;
			return prev;
		}, false);

	} else {
		if (item[prop] === value) returnValue = true;
	}

	return returnValue;
}

function runDepMatch (item, rule, prop) {
	let dep = rule.dep;
	let depValue = rule.depValue;
	let values = rule.values;
	let returnValue = false;

	if (item[dep] === depValue) {
		if (Array.isArray(values)) {
			returnValue = values.reduce((prev, value) => {
				if (item[prop] === value) prev = true;
				return prev;
			}, false);
		}
	}

	return returnValue;
}

function runLess (item, rule, prop) {
	let returnValue = false;
	let value = rule.value;

	if (item[prop] < value) returnValue = true;

	return returnValue;
}

function runGreater (item, rule, prop) {
	let returnValue = false;
	let value = rule.value;

	if (item[prop] > value) returnValue = true;

	return returnValue;
}
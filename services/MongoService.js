"use strict";
const MongoClient = require('mongodb').MongoClient
const config = require("../config.json");

const DB_URL = config.db_url;
const DB_PORT = config.db_port;
const DB_USER = config.db_user;
const DB_PASS = config.db_password;


module.exports = {
	connect: function () {

	},

	findNote: function (loanId) {
		var url = `mongodb://${DB_USER}:${DB_PASS}@${DB_URL}:${DB_PORT}/loan_parser_notes`;
		return new Promise((resolve, reject) => {
			// Use connect method to connect to the Server 
			MongoClient.connect(url, function(err, db) {
				
				var collection = db.collection('notes');

				collection.find({"LoanId": loanId}).toArray(function(err, docs) {
					docs.length > 0 ? resolve(true) : resolve(false);
				});

			  db.close();
			});
			
		});
	},
	getData: function (loanId) {
		var url = `mongodb://${DB_USER}:${DB_PASS}@${DB_URL}:${DB_PORT}/loan_parser_notes`;
		return new Promise((resolve, reject) => {
			// Use connect method to connect to the Server 
			MongoClient.connect(url, function(err, db) {
				
				var collection = db.collection('notes');

				collection.find({"LoanId": loanId}).toArray(function(err, docs) {
					resolve(docs[0]);
				});

			  db.close();
			});
			
		});
	},

	updateNote: function (obj, loadId) {
		var url = `mongodb://${DB_USER}:${DB_PASS}@${DB_URL}:${DB_PORT}/loan_parser_notes`;
		return new Promise((resolve, reject) => {
			// Use connect method to connect to the Server 
			MongoClient.connect(url, function(err, db) {
				
				var collection = db.collection('notes');
				collection.update({"LoanId": loadId}, obj, (err, count, obj) => {
				})

			  db.close();
			});
			
		});
	},

	insertNote: function (obj) {
		var url = `mongodb://${DB_USER}:${DB_PASS}@${DB_URL}:${DB_PORT}/loan_parser_notes`;
		// Use connect method to connect to the Server 
		MongoClient.connect(url, function(err, db) {
			var collection = db.collection('notes');

			collection.insertOne(obj);

			db.close();
		});
	},

	find: function (loanId) {
		var url = `mongodb://${DB_USER}:${DB_PASS}@${DB_URL}:${DB_PORT}/loan_parser_notes`;
		return new Promise((resolve, reject) => {
			// Use connect method to connect to the Server 
			MongoClient.connect(url, function(err, db) {
				
				var collection = db.collection('currentLoans');

				collection.find({"loanId": loanId}).toArray(function(err, docs) {
					docs.length > 0 ? resolve(true) : resolve(false);
				});

			  db.close();
			});
			
		});
	},
	insert: function (loanId) {
			var url = `mongodb://${DB_USER}:${DB_PASS}@${DB_URL}:${DB_PORT}/loan_parser_notes`;
			// Use connect method to connect to the Server 
			MongoClient.connect(url, function(err, db) {
				
				var collection = db.collection('currentLoans');

				collection.insertOne({"loanId": loanId});

			  db.close();
			});
	}
}



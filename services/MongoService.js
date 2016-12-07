"use strict";
const MongoClient = require('mongodb').MongoClient


module.exports = {
	connect: function () {

	},
	find: function (loanId) {
		var url = 'mongodb://localhost:27017/loans';
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
			var url = 'mongodb://localhost:27017/loans';
			// Use connect method to connect to the Server 
			MongoClient.connect(url, function(err, db) {
				
				var collection = db.collection('currentLoans');

				collection.insertOne({"loanId": loanId});

			  db.close();
			});
	}
}



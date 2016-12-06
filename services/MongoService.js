"use strict";
const MongoClient = require('mongodb').MongoClient


module.exports = {
	connect: function () {
		var url = 'mongodb://localhost:27017/loans';
		// Use connect method to connect to the Server 
		MongoClient.connect(url, function(err, db) {
			console.log({
				err: err,
				db: db
			})
		  db.close();
		});
	}
}


const mongoService = require("../services/MongoService");


module.exports = function (app) {
	app.get('/getNotes', function (req, res) {
		mongoService.getAllData().then((data) => {
			res.send(data)
		})
	})
}
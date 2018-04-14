const express = require('express')
const app = express();
const path = require("path");
const routeLoader = require("./routeLoader");
const cors = require('cors')
 
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(cors())	

routeLoader(app, path.join(__dirname, "routes"));
app.listen(4000)
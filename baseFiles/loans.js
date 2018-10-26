"use strict";
const request = require('request');
const config = require("../config");
const service = require("../services/loanService");
const buyService = require("../services/buyService");
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const text = require('textbelt');

const API_KEY = config.apiKey;
const ACCOUNT_KEY = config.accountKey;

let loanService = function () {};

loanService.prototype.startLoans = function () {
	console.log("start")
	let ops = getOps();

	/*
	 	service.getLoans(ops).then((data) => {
	 		console.log("end")
	 		if(data.length > 0) {
	 			sendText(data)
	 		}
		}); 
*/


	schedule.scheduleJob('5 6,10,14,18 * * 1-5', function(){
	 	service.getLoans(ops).then((data) => {
	 		console.log("end")
	 		if(data.length > 0) {
	 			sendText(data)
	 		}
		}); 
	});

}

function getLoanUrls () {
	return {
		listing: 'https://api.lendingclub.com/api/investor/v1/loans/listing?showAll=true',
		folio: `https://api.lendingclub.com/api/investor/v1/accounts/${ACCOUNT_KEY}/trades/buy/`
	}
}

function getOps () {
	return {
		url: getLoanUrls().listing,
		headers: {
			"Content-type": "application/json",
			"Accept": "application/json",
			"Authorization": API_KEY,
			"X-LC-LISTING-VERSION": 1.3
		}
	}
}

function testEmail () {
	nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "obabb2w5rvgbr6ad@ethereal.email", // generated ethereal user
            pass: "PMYqSFbtuanZsjHXNc" // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'arttay1090@gmail.com', // sender address
        to: 'arttay1090@yahoo.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});
}

function sendText (data) {
	console.log(data);
	/*
	request.post('https://textbelt.com/text', {
	  form: {
	    phone: '',
	    message: JSON.stringify(data),
	    key: '',
	  },
	}, function(err, httpResponse, body) {
	  if (err) {
	    console.error('Error:', err);
	    return;
	  }
	})
*/
}

module.exports = new loanService();

















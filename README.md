#Lending club loan parser
This is an engine to parse both lending club loans and secondary market notes.

##Install
`Npm install` should be everything you need.

##After install
You need a Lending club account in order for this application to run. After you have an api key and account key, create a file called `config.json` in the base directory. The file should look similar to:

	
~~~~
{
	"apiKey": "<APIKEY>",
	"accountKey": "<ACCOUNTKEY>"
}
~~~~


##Run
To run the loan parser `node index.js`.

To run the notes parser `npm start` 


##Todo's
1. Move all modules to an addon architecture(https://medium.com/developers-writing/how-to-get-a-performance-boost-using-node-js-native-addons-fd3a24719c85#.czixowduy)

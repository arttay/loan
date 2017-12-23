"use strict";
const loans       = require("./baseFiles/loans");
const notes       = require("./baseFiles/notes");
const argv        = require('yargs').argv;
const cluster 		= require('cluster');
const numCPUs 		= require('os').cpus().length;


  if (argv.type === "loans") {
    loans.startLoans();
  } else if (argv.type === "notes") {
    notes.startNotes();
  } else {
    loans.startLoans();
  }


/*
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
  	//create a new instance of the app on each cpu core
  	setTimeout(() => {
		cluster.fork();
  	}, 5000)
    
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    //Getting the number of threads with an app running on them
    let numberOfWorkingCores = Object.keys(cluster.workers).length;
    if (numberOfWorkingCores !== numCPUs && numberOfWorkingCores < numCPUs) {
    	//If a cpiu core is available...
    	//spin up a new server thread to replace the one that died.
    	cluster.fork();
    }
    console.log({
    	message: "spinning up new app...",
    	workingCores: numberOfWorkingCores,
    	availCores: numCPUs
    })
  });
} else {
	if (argv.type === "loans") {
		loans.startLoans();
	} else if (argv.type === "notes") {
		notes.startNotes();
	} else {
		loans.startLoans();
	}
}
*/
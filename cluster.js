var cluster = require('cluster');
var os = require('os');
var http = require('http');
//get the num of cpu

var numCPUs = os.cpus().length;

var workers = {};
if (cluster.isMaster) {
	cluster.on('exit', function(worker) {
		delete workers[worker.pid];
		worker = cluster.fork();
		workers[worker.pid] = worker;
	});
	console.log('i am a master');
	for (var i = 0; i < numCPUs; i++) {
		var worker = cluster.fork();
		workers[worker.pid] = worker;

		console.log('i am worker #' + worker.id);
	}
} else {
	var app = require('./app');
	app.starup();
}

process.on('SIGTERM', function() {
	for (var pid in workers) {
		process.kill(pid);
	}
	process.exit(0);
});

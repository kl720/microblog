/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var partials = require('express-partials');
var sessionStorage = require('./models/sessionStorage');
//var flash = require('connect-flash');

var fs = require('fs');
var accessLogFile = fs.createWriteStream('access.log', {
	flags : 'a'
});
var errorLogFile = fs.createWriteStream('error.log', {
	flags : 'a'
});

var app = express();
app.set('env', 'development');
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.logger({
	stream : accessLogFile
}));
app.configure('development', function() {
	app.use(express.errorHandler());
});

app.configure('production', function() {
	app.use(function(err, req, res, next) {
		console.log('error-error');
		var meta = '[' + new Date() + ']' + req.url + '\n';
		errorLogFile.write(meta + err.stack + '\n');
	});
});

//app.use(flash());
app.use(partials());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.cookieParser());

app.use(express.session({
	secret : settings.cookieSecret,
	key : settings.db,
	cookie : {
		maxAge : 1000 * 60 * 60 * 24 * 30
	}, //30 days
	store : new MongoStore({
		db : settings.db
	})
}));

app.use(function(req, res, next) {
	res.locals.user = req.session.user;
	res.locals.error = sessionStorage.getItem('error');
	res.locals.success = sessionStorage.getItem('success');
	next();
});
app.use(app.router);

routes(app);

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}
app.use(function(req, res, next) {
	var error = req.flash('error');
	var success = req.flash('success');
	res.locals.user = req.session.user;
	res.locals.error = error.length ? error : null;
	res.locals.success = success ? success : null;
	next();
});
if (!module.parent) {
	http.createServer(app).listen(app.get('port'), function() {
		console.log('Express server listening on port ' + app.get('port'));
	});
}


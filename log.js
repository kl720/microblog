 var log4js = require('log4js');
// log4js.configure({
	// appenders : [{
		// type : 'console',
		// category : "console"
	// }, //控制台输出
	// {
		// type : "dateFile",
		// filename : 'logs/log.log',
		// pattern : "_yyyy-MM-dd",
		// alwaysIncludePattern : false,
		// category : 'dateFileLog'
	// }//日期文件格式
	// ],
	// replaceConsole : true, //替换console.log
	// levels : {
		// dateFileLog : 'INFO'
	// }
// });
log4js.configure({
	appenders : [{
		type : 'console'
	}, {
		type : 'file',
		filename : './logs/access.log',
		maxLogSize : 1024*1024,
		backups : 3,
		category :  [ 'normal','console' ]     //console 类型可使console内容写入日志
	}],
	 replaceConsole: true
});
var dateFileLog = log4js.getLogger('normal');

exports.logger = dateFileLog;

exports.use = function(app) {
	//页面请求日志,用auto的话,默认级别是WARN
	//app.use(log4js.connectLogger(dateFileLog, {level:'auto', format:':method :url'}));
app.use(log4js.connectLogger(dateFileLog, {
	level : log4js.levels.INFO,
	formate:':method :url'
}));
}  
/*
 * GET home page.
 */
var crypto = require('crypto');
var User = require('../models/user.js');
var sessionStorage = require('../models/sessionStorage');
var Post = require('../models/post.js');
module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('index', {
			title : '首页',
		});
		throw new Error('An error for test purposes.');
	});

	app.get('/reg', function(req, res) {
		res.render('reg', {
			title : '用户注册',
		});
	});

	app.post('/reg', function(req, res) {
		console.log(req.body.inputUsername);
		//检查用户两次输入口令是否一致
		if (req.body.inputPassword4 != req.body.inputPassword3) {
			console.log('error两次输入密码不一致');
			sessionStorage.setItem('error', '两次输入密码不一致！');
			return res.redirect('/reg');
		}

		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.inputPassword3).digest('base64');

		var newUser = new User({
			name : req.body.inputUsername,
			password : password,
		});

		User.get(newUser.name, function(err, user) {
			if (user) {
				err = '用户名已存在';
				console.log(err);
			}

			if (err) {
				console.log("失败");
				sessionStorage.setItem('error', err);
				return res.redirect('/reg');
			}
			newUser.save(function(err) {
				if (err) {
					sessionStorage.setItem('error', err);
					return res.redirect('/reg');
				}
				console.log("注册成功");
				req.session.user = newUser;
				sessionStorage.setItem('success', '注册成功');
				res.redirect('/');
			});
		});
	});
	app.get('/login', function(req, res) {
		res.render('login', {
			title : '用户登入',
		})
	})

	app.post('/login', function(req, res) {
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');

		User.get(req.body.username, function(err, user) {
			if (!user) {
				sessionStorage.setItem('error', '用户不存在');
				return res.redirect('/login');
			}
			if (user.password != password) {
				sessionStorage.setItem('error', '用户口令错误');
				return res.redirect('/login');
			}
			req.session.user = user;
			sessionStorage.setItem('success', '登入成功');
			res.redirect('/');
		})
	});

	app.get('/logout', function(req, res) {
		req.session.user = null;

		sessionStorage.setItem('success', '登出成功');
		res.redirect('/');
	});

	app.get('/say', checkLogin);
	app.get('/say', function(req, res) {
		res.redirect('/u/' + req.session.user.name);
	});

	app.post('/post', checkLogin);

	app.post('/post', function(req, res) {
		var currentUser = req.session.user;
		var post = new Post(currentUser.name, req.body.post);
		post.save(function(err) {
			if (err) {
				sessionStorage.setItem('error', '发言发生错误');
				return res.redirect('/');
			}
			sessionStorage.setItem('success', '发言成功');
			res.redirect('/u/' + currentUser.name);
		})
	});

	app.post('/deletepost', function(req, res) {
		var currentUser = req.session.user;

		
		Post.deleteP(req.body.post, function(err, count) {
			if (err) {
				sessionStorage.setItem('error', '删除发生错误');
				return res.redirect('/');
			}
			sessionStorage.setItem('success', '删除' + count + '条');
			res.redirect('/u/' + currentUser.name);
			console.log('test');
		});
	});

	app.get('/u/:user', function(req, res) {
		User.get(req.params.user, function(err, user) {

			if (!user) {
				sessionStorage.setItem('error', '用户不存在');
				return res.redirect('/');
			}
			Post.get(user.name, function(err, posts) {
				if (err) {
					sessionStorage.setItem('error', err);
					return res.redirect('/');
				}
				res.render('user', {
					title : user.name,
					posts : posts,
				});
				console.log('ttt');
			});
		});
	});

}
function checkLogin(req, res, next) {
	if (!req.session.user) {
		sessionStorage.setItem('error', '未登入');
		return res.redirect('/login');
	}
	next();
}

function checkNotLogin(req, res, next) {
	if (req.session.user) {
		sessionStorage.setItem('error', '已登入');
		return res.redirect('/');
	}
	next();
}

exports.index = function(req, res) {
	res.render('index', {
		title : 'Express'
	});
};
exports.hello = function(req, res) {
	res.send('The time is ' + new Date().toString());
};
exports.user = function(req, res) {

};
exports.post = function(req, res) {

};
exports.reg = function(req, res) {

};
exports.doReg = function(req, res) {

};
exports.login = function(req, res) {

};
exports.doLogin = function(req, res) {

};
exports.logout = function(req, res) {

};
exports.deletepost = function(req, res) {

};

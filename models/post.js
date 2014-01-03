var mongodb = require('./db');
var kdate = require('./KDate');
function Post(username, post, time) {
	this.user = username;
	this.post = post;

	if (time) {
		this.time = time;
	} else {
		this.time = kdate.currentTime();
	}

};

module.exports = Post;

Post.prototype.save = function save(callback) {
	var post = {
		user : this.user,
		post : this.post,
		time : this.time,
	};
	console.log('post-' + this.time);
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.ensureIndex('user');
			collection.insert(post, {
				safe : true
			}, function(err, post) {
				mongodb.close();
				callback(err, post);
			});
		});
	});
};

Post.get = function get(username, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if (username) {
				query.user = username;
			}

			collection.find(query).sort({time:-1}).toArray(function(err, docs) {
				mongodb.close();
				if (err) {
					mongodb.close();
					callback(err, null);
				}
				var posts = [];
				docs.forEach(function(doc, index) {
					var post = new Post(doc.user, doc.post, doc.time);
					posts.push(post);
				});
				console.log("结果数据集-" + posts.length);
				
				callback(null, posts);
			});
		});
	});
}
Post.deleteP = function deleteP(post, callback) {
	mongodb.close();
	mongodb.open(function(err, db) {
		
		if (err) {
			
			return callback(err);
		}
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
			var deletequery = {};
			if (!post) {
				callback('参数为空，无法删除');
			} else {
				deletequery.post = post;
				collection.remove(deletequery, {
					safe : true
				}, function(error, count) {
					//collection.remove();
					mongodb.close();
					callback(error,count);
				});
			}
		});

	});
}


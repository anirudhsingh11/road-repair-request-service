var User = require('../models/user');
var Request = require('../models/request');

var async = require('async');

var auth = require('./authorizationPermissions');

//Display SignUp Form GET
exports.user_create_get = function (req, res, next) {
	res.render('signup');
}

//Handle SignUp Form POST
exports.user_create_post = function (req, res, next) {
	User.findOne({ 'email': req.body.email }).exec(function (err, found_user) {
		if (err) { next(err); }
		if (found_user) {
			err = new Error("User Exist");
			return next(err);
		} else {
			var userdetail = {
				first_name: req.body.fname,
				last_name: req.body.lname,
				password: req.body.password,
				email: req.body.email,
				mobile: req.body.mobile,
				user_type: req.body.userType
			}

			var user = new User(userdetail);

			user.save(function (err, user) {
				if (err) { return next(err); }
				req.session.user = user;
				res.redirect('/user/dashboard');
			});
		}
	});
}

//Handle SignUp Form from Admin POST
exports.admin_create_user_post = [
	auth.checkSignIn,
	function (req, res, next) {
	User.findOne({ 'email': req.body.email }).exec(function (err, found_user) {
		if (err) { next(err); }
		if (found_user) {
			err = new Error("User Exist");
			return next(err);
		} else {
			var userdetail = {
				first_name: req.body.fname,
				last_name: req.body.lname,
				password: req.body.password,
				email: req.body.email,
				mobile: req.body.mobile,
				user_type: req.body.userType
			}

			var user = new User(userdetail);

			user.save(function (err, user) {
				if (err) { return next(err); }
				res.redirect('/user/dashboard');
			});
		}
	});
}]

//Display login form GET
exports.user_login_get = function (req, res, next) {
	res.render('index');
}

//Handle Login form POST
exports.user_login_post = function (req, res, next) {
	User.findOne({ email: req.body.email, password: req.body.password }, function (err, user) {
		if (err) { return next(err); }
		if (!user) {
			var err = new Error("User not found");
			err.status = 403;
			return next(err);
		}
		req.session.user = user;
		res.redirect('/user/dashboard');
	});
}
//Functions to display various Dashboards
function userDashboard(req, res, next) {
	async.parallel({
		requests: function (cb) {
			Request.find({user: req.session.user._id}).populate({
				path: 'user',
				model: 'User',
				select: 'first_name last_name mobile'
			}).exec(function (err, requests) {
				if (err) return next(err);
				cb(null, requests);
			});
		},
		user: function (cb) {
			var user = req.session.user;
			cb(null, user);
		},
		engineers: function (cb) {
			User.find({ user_type: 'engineer' }, 'first_name last_name', function (err, engineers) {
				if (err) return next(err);
				cb(null, engineers);
			});
		},
		contractors: function (cb) {
			User.find({ user_type: 'contractor' }, 'first_name last_name', function (err, contractors) {
				if (err) return next(err);
				cb(null, contractors);
			});
		}
	}, function (err, data) {
		res.render('userdash', { data: data });
	});
}

function adminDashboard(req, res, next) {
	async.parallel({
		requests: function (cb) {
			Request.find().populate({
				path: 'user',
				model: 'User',
				select: 'first_name last_name mobile'
			}).populate({
				path: 'engineer',
				model: 'User',
				select: 'first_name last_name'
			}).populate({
				path: 'contractor',
				model: 'User',
				select: 'first_name last_name'
			}).exec(function (err, requests) {
				if (err) return next(err);
				console.log(requests.engineer);
				cb(null, requests);
			});
		},
		user: function (cb) {
			var user = req.session.user;
			cb(null, user);
		},
		engineers: function (cb) {
			User.find({ user_type: 'engineer' }, 'first_name last_name', function (err, engineers) {
				if (err) return next(err);
				cb(null, engineers);
			});
		},
		contractors: function (cb) {
			User.find({ user_type: 'contractor' }, 'first_name last_name', function (err, contractors) {
				if (err) return next(err);
				cb(null, contractors);
			});
		}
	}, function (err, data) {
		res.render('admindash', { data: data });
	});
}

function engineerDashboard(req, res, next) {
	async.parallel({
		requests: function (cb) {
			Request.find({ engineer: req.session.user._id }).populate({
				path: 'user',
				model: 'User',
				select: 'first_name last_name mobile'
			}).exec(function (err, requests) {
				if (err) return next(err);
				cb(null, requests);
			});
		},
		user: function (cb) {
			var user = req.session.user;
			cb(null, user);
		},
	}, function (err, data) {
		res.render('engineerdash', { data: data });
	});
}

function contractorDashboard(req, res, next) {
	async.parallel({
		requests: function (cb) {
			Request.find({contractor: req.session.user._id}).populate({
				path: 'user',
				model: 'User',
				select: 'first_name last_name mobile'
			}).exec(function (err, requests) {
				if (err) return next(err);
				cb(null, requests);
			});
		},
		tender: function (cb) {
			Request.find({ status: 'engineerAlloted' }).populate({
				path: 'user',
				model: 'User',
				select: 'first_name last_name mobile'
			}).exec(function(err, tender){
				if (err) return next(err);
				cb(null, tender)
			});
		},
		user: function (cb) {
			var user = req.session.user;
			cb(null, user);
		},
		engineers: function (cb) {
			User.find({ user_type: 'engineer' }, 'first_name last_name mobile', function (err, engineers) {
				if (err) return next(err);
				cb(null, engineers);
			});
		},
	}, function (err, data) {
		res.render('contractordash', { data: data });
	});
}

//Display dashboard GET
exports.user_dashboard_get = [
	auth.checkSignIn,
	function (req, res, next) {
		var userType = req.session.user.user_type;
		if (userType == 'admin') {
			adminDashboard(req, res, next);
		} else if (userType == 'user') {
			userDashboard(req, res, next);
		} else if (userType == 'contractor') {
			contractorDashboard(req, res, next);
		} else if(userType == 'engineer') {
			engineerDashboard(req, res, next);
		} else {
			res.next(err);
	}
}]

//Handle update profile POST
exports.user_update_post = [
	auth.checkSignIn,
	function (req, res, next) {
	userid = req.session.user._id;
	var user = new User({
		first_name: req.body.fname,
		last_name: req.body.lname,
		password: req.body.password,
		email: req.body.email,
		mobile: req.body.mobile,
		_id: req.session.user._id,
		user_type: req.session.user.user_type
	});

	User.findByIdAndUpdate(userid, user, function (err, updated) {
		if (err) {
			return next(err);
		} else {
			req.session.user = user;
			console.log("user updated");
			res.redirect('/user/dashboard');
		}
	})
}]

//HAndle user logout POST
exports.user_logout_get = [
	auth.checkSignIn,
	function (req, res, next) {
	req.session.destroy(function () {
		res.redirect('/');
	});
}]
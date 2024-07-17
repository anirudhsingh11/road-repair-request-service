var User = require('../models/user');
var Request = require('../models/request');
var async = require('async');

var auth = require('./authorizationPermissions');

//Handle Generate Request POST
exports.user_generate_request_post = [
    auth.checkSignIn,
    function (req, res, next) {
    var requestDetail = {
        user: req.session.user,
        address: {
            lat: Number(req.body.lat),
            lng: Number(req.body.lng)
        },
        status: "submitted"
    }
    var request = new Request(requestDetail);
    request.save(function(err, saved){
        if(err){
            return next(err);
        } else {
            res.redirect('/user/dashboard');
        }
    })
}]

//Update Request POST
exports.request_update_post = [
    auth.checkSignIn,
    function(req, res, next){
    var request = new Request({
        _id: req.body.request_id,
        user: req.body.request_user_id,
        address: {
            lat: req.body.request_add_lat,
            lng: req.body.request_add_lng
        },
        status: req.body.status,
		engineer: req.body.engineer,
		contractor: req.body.contractor
    });
    // res.send(req.body);
	Request.findByIdAndUpdate(req.body.request_id, request, function (err, updated) {
		if (err) {
			return next(err);
		} else {
			console.log("request updated");
			res.redirect('/user/dashboard');
		}
	})
}]

exports.delete_request_post = [
    auth.checkSignIn,
    function(req, res, next){
    requestid = req.body.request_id;
    Request.findByIdAndRemove(requestid, function(err, removed){
        if(err) next(err);
        console.log("request deleted");
        res.redirect('/user/dashboard');
    })
}]

//View Map for engineer POST
exports.view_map_post = [
    auth.checkSignIn,
    function(req, res, next){
    async.parallel({
		lat: function (cb) {
            lat = req.body.request_lat;
            cb(null, lat);
		},
		lng: function (cb) {
            lng = req.body.request_lng;
            cb(null, lng);
		},
	}, function (err, data) {
        console.log(data);
		res.render('map', { data: data });
	});
}]
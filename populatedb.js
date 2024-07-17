#! /usr/bin/env node

console.log('This script populates some test users to our database.');

var async = require('async');
var User = require('./models/user'); // Assuming your user model is in './models/user.js'

var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/rrs';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = [];

// Define function to create users
function userCreate(first_name, last_name, email, mobile, password, user_type, cb) {
    var userDetails = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        mobile: mobile,
        password: password,
        user_type: user_type
    };

    var user = new User(userDetails);
    user.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New User created: ' + user);
        users.push(user);
        cb(null, user);
    });
}

// Create users serially
function createUsers(cb) {
    async.series([
        function (callback) {
            userCreate('Nilesh', 'Prajapat', 'nilesh@gmail.com', 8982116764, '123', 'user', callback);
        },
        function (callback) {
            userCreate('Murtaza', 'Mehmudji', 'murtaza@gmail.com', 8109861206, '123', 'engineer', callback);
        },
        function (callback) {
            userCreate('Chandra Pratap', 'Mandloi', 'chandra@gmail.com', 9644069108, '123', 'admin', callback);
        },
        function (callback) {
            userCreate('Rajnish Pratap', 'Singh', 'rajnish@gmail.com', 8359808247, '123', 'contractor', callback);
        }
    ],
    // optional callback
    cb);
}

// Execute user creation
createUsers(function (err, results) {
    if (err) {
        console.error('FINAL ERR: ' + err);
    } else {
        console.log('Users successfully created.');
    }
    // Disconnect from database
    mongoose.connection.close();
});

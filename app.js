var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require("express-session");
var MongoDBStore = require('connect-mongodb-session')(session);

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var requestRouter = require('./routes/request');
var app = express();
require('dotenv').config();

var mongoDB = process.env.MONGODB_URI || 'mongodb://localhost:27017/rrs';  // Use the correct database name

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log("Connected to Database");
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Create a new instance of MongoDBStore
const store = new MongoDBStore({
  uri: mongoDB,
  collection: 'sessions'
});

app.use(session({
  secret: "kisikobatanamat",
  resave: false,
  saveUninitialized: false,
  store: store // Use the MongoDBStore instance
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/request', requestRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
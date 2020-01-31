var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var api = require('./routes/api');

var app = express();

const baseAddress = 'http://localhost';
app.set('baseAddress', baseAddress);

// MySQL setup
const mysql = require('mysql');
const cstr = { host: 'localhost', user: 'root', password: 'D@1syKn0ws', database: 'monitor_db' };
const db = mysql.createConnection(cstr);
app.set('db', db);

// Wordnet setup
const natural = require('natural');
const wordnet = new natural.WordNet();
app.set('wordnet', wordnet);

// Child Process
const spawn = require('child_process');
app.set('spawn', spawn);

// views
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: baseAddress + ':4200'
}));

app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

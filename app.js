var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var User = require('./models/users');
var Product = require('./models/pro');
var http = require("http");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var addRouter = require('./routes/add');


var port = process.env.PORT || 5000;
var app = express();
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);



mongoose.connect('mongodb+srv://admin1:faiq55@flask.akghk.mongodb.net/users?retryWrites=true&w=majority', (err) => {
  if (!err) {
    console.log('No Error');
  } else {
    console.log('Error Occured')
  }
});

require('./config/passport');
// view engine setup
app.engine('.hbs', hbs({
  defaultLayout: 'layout',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(validator());


app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,

  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  cookie: {
    maxAge: 2880 * 60 * 1000
  }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));


app.use('/', function (req, res, next) {
  
  var Tcount =1;
  res.locals.Tcount=20+Tcount++;


  Product.find(function (err, docs) {
    res.locals.Ucount = docs.length;
  });



  User.find(function (err, docs) {
    res.locals.Pcount = docs.length;
  });




  res.locals.login = req.isAuthenticated();
  // res.locals.admin = req.user.admin;
  res.locals.session = req.session;
  next();
});





app.use('/user', usersRouter);
app.use('/add', addRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;

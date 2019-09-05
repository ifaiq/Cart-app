var express = require('express');
var router = express.Router();
var passport = require('passport');
var Product = require('../models/pro');

/* GET home page. */

router.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  next();
});


router.get('/', function(req, res, next) {
  Product.find(function(err, docs) {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
        productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Shopping Cart', products: productChunks });
});
});




router.get('/user/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', {hasErrors: messages.length > 0, messages: messages});
});

router.post('/user/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/user/signin', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', {hasErrors: messages.length > 0, messages: messages});
});

router.post('/user/signin', passport.authenticate('local.signin', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}));

router.get('/user/logout', function(req, res, next) {
  req.logout();
  return res.redirect('/');
});

router.get('/user/profile', isLoggedIn, function(req, res, next) {
  res.render('user/profile');
});

module.exports = router;


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/');
}
var express = require('express');
var router = express.Router();
var passport = require('passport');
var Product = require('../models/pro');
var User = require('../models/users');

var Order = require('../models/orders');
var Cart = require('../models/cart');

var csrf = require('csurf');
var csrfProtection = csrf();
router.use(csrfProtection);


/* GET users listing. */



router.get('/admin', isLoggedIn, isAdmin, function (req, res, next) {
  var options = {
    cache: true,
    title: 'Express'
  };
  User.find(function (err, docs) {
    var userChunks = [];
    var chunkSize = 8;
    for (var i = 0; i < docs.length; i += chunkSize) {
      userChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('user/admin', {
      // orders: orders,
      user: userChunks,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      address: req.user.address,
      post: req.user.post,
      city: req.user.city,
      country: req.user.country
    });
  });
});

router.get('/admin/api', isLoggedIn, isAdmin, function (req, res, next) {
  var options = {
    cache: true,
    title: 'Express'
  };
  User.find(function (err, docs) {
    var userChunks = [];
    var chunkSize = 8;
    for (var i = 0; i < docs.length; i += chunkSize) {
      userChunks.push(docs.slice(i, i + chunkSize));
    }
    res.send({userChunks});
  });
});



router.get('/delete/:id', isLoggedIn, isAdmin, function (req, res, next) {
      var productId = req.params.id;
      User.findByIdAndRemove({
        productId
      }, (err, res) => {
        if (err) {
          return console.log(res)
          
        }


        res.redirect('/user/admin');
      });
    });

      // router.get('/search', function (req, res, next) {
      //   var options = {
      //     cache: true,
      //     title: 'Express'
      //   };
      //   var email = req.query.search;
      //   User.findOne({email},function (err, user) {
      //     if (err) {
      //       res.json({
      //           status: 0,
      //           message: err
      //       });
      //   }
      //     res.render('user/admin', {
      //       // orders: orders,
      //       name: req.user.name,
      //       email: req.user.email,
      //       phone: req.user.phone,
      //       address: req.user.address,
      //       city: req.user.city,
      //       country: req.user.country
      //     });
      //   });
      // });



      router.get('/profile', isLoggedIn, function (req, res, next) {
        Order.find({
          user: req.user
        }, function (err, orders) {
          if (err) {
            return res.write('Error!');
          }
          var cart;
          orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
          });
          res.render('user/profile', {
            orders: orders,
            user: req.user.name
          });
        });
      });




      router.get('/logout', function (req, res, next) {

        req.session.cart = null;
        req.logout();
        return res.redirect('/');
      });




      router.get('/', notLoggedIn, function (req, res, next) {
        next();
      });


      router.get('/signup', function (req, res, next) {
        var messages = req.flash('error');
        res.render('user/signup', {
          csrfToken: req.csrfToken(),
          messages: messages,
          hasErrors: messages.length > 0
        });
      });



      router.post('/signup', passport.authenticate('local.signup', {
        failureRedirect: '/user/signup',
        failureFlash: true
      }), function (req, res, next) {
        if (req.session.oldUrl) {
          var oldUrl = req.session.oldUrl;
          req.session.oldUrl = null;
          res.redirect(oldUrl);
        } else {
          res.redirect('/user/profile');
        }
      });



      router.get('/signin', function (req, res, next) {
        var messages = req.flash('error');
        res.render('user/signin', {
          csrfToken: req.csrfToken(),
          messages: messages,
          hasErrors: messages.length > 0
        });
      });




      router.post('/signin', passport.authenticate('local.signin', {
        failureRedirect: '/user/signin',
        failureFlash: true
      }), function (req, res, next) {
        if (req.session.oldUrl) {
          var oldUrl = req.session.oldUrl;
          req.session.oldUrl = null;
          res.redirect(oldUrl);
        } else {
          res.redirect('/user/profile');
        }
      });



      module.exports = router;


      function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
          return next();
        }
        res.redirect('/');
      }

      function isAdmin(req, res, next) {
        if (req.user.admin === 1) {
          return next();
        }
        req.flash('error', 'Not Admin')
        res.redirect('/');
      }

      function notLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
          return next();
        }
        res.redirect('/');
      }

      function escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      };
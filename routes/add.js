
var express = require('express');
var router = express.Router();
var passport = require('passport');

var Product = require('../models/pro');

var mongoose = require('mongoose');

// mongoose.connect('mongodb://admin:admin1@ds217208.mlab.com:17208/pdf', (err) => {
//     if (!err) {
//         console.log('No Error');
//     } else {
//         console.log('Error Occured')
//     }
// });

// var products = [
//     new Product({
//         imagePath: 'https://images3.penguinrandomhouse.com/cover/9780399585050',
//         title: 'Book',
//         description: 'Awesome Book!!!!',
//         price: 10
//     }),
//     new Product({
//         imagePath: 'https://s26162.pcdn.co/wp-content/uploads/2019/01/9781616208882.jpg',
//         title: 'Book',
//         description: 'Also awesome? But of course it was better in vanilla ...',
//         price: 20
//     }),
//     new Product({
//         imagePath: 'https://e3t6q7b4.stackpathcdn.com/wp-content/uploads/2018/09/five-feet-apart-9781534437333_hr-679x1024.jpg',
//         title: 'Book',
//         description: 'Meh ... nah, it\'s okay I guess',
//         price: 40
//     }),
//     new Product({
//         imagePath: 'https://pmcdeadline2.files.wordpress.com/2014/02/minecraft__140227211000.jpg',
//         title: 'Minecraft Video Game',
//         description: 'Now that is super awesome!',
//         price: 15
//     }),
//     new Product({
//         imagePath: 'https://d1r7xvmnymv7kg.cloudfront.net/sites_products/darksouls3/assets/img/DARKSOUL_facebook_mini.jpg',
//         title: 'Dark Souls 3 Video Game',
//         description: 'I died!',
//         price: 50
//     })
// ];

// var done = 0;
// for (var i = 0; i < products.length; i++) {
//     products[i].save(function (err, result) {
//         done++;
//         if (done === products.length) {
//             exit();
//         }
//     });
// }

// function exit() {
//     mongoose.disconnect();
// }




router.get('/',  isLoggedIn, isAdmin, function (req, res, next) {

      res.render('shop/add');
});


router.post('/',isLoggedIn,isAdmin, function (req, res, next) {
    var myData = new Product();
    myData.title=req.body.title;
    myData.price=req.body.price;
    myData.pro=req.body.pro;
    myData.description=req.body.description;
    myData.image=req.body.image;
    
    
    myData.save()
      .then(item => {
        res.send("item saved to database");
      })
      .catch(err => {
        res.status(400).send("unable to save to database");
      })
      res.render('shop/add');
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
    res.redirect('/');
  }
  
  
  function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
  }
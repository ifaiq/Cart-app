
var express = require('express');
var router = express.Router();
var passport = require('passport');

var Product = require('../models/pro');

var mongoose = require('mongoose');



router.get('/', isLoggedIn,isAdmin, function(req, res, next) {
  var successMsg = req.flash('success')[0];


  


  Product.find(function(err, docs) {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
        productChunks.push(docs.slice(i, i + chunkSize));
    }
    
    res.render('shop/add', { title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg});
});
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
  

  router.get('/add/delete/:id', function (req, res, next) {
    console.log(req.params.id);
    Product.findByIdAndRemove(req.params.id, (err, res) => {
      if (err) {
        return console.log(err)
        
      }


      
    });
    res.redirect('/shop/add');
  });

module.exports = router;




// function count(){
  
//   var noU = Product.countDocuments(function(err, docs) {
//     if (err){
//       console.log(err);
//     }
//     return doc.length;
//       });
// }

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
var passport = require('passport');
var User = require('../models/users');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true


}, function (req, email, password , done) {
    req.checkBody('name', 'Provide Name').notEmpty();
    req.checkBody('address', 'Provide Address').notEmpty();
    req.checkBody('phone', 'Provide Number').notEmpty();
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({
        min: 8
    });
    req.checkBody('password2', 'Password do not match').equals(req.body.password)

    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({
        'email': email
    }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, {
                message: 'Email is already in use.'
            });
        }
        var newUser = new User();
        newUser.name = req.body.name;
        newUser.address = req.body.address;
        newUser.phone = req.body.phone;
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.password2 = req.body.password2;
        newUser.save(function (err, result) {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({
        'email': email
    }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {
                message: 'No user found.'
            });
        }
        if (!user.validPassword(password)) {
            return done(null, false, {
                message: 'Wrong password.'
            });
        }
        return done(null, user);
    });
}));
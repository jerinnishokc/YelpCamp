var express = require('express');
var router = express.Router();
var User = require('../models/users');
var passport = require('passport');

router.get('/register', (req, res) => {
	res.render('register');
});

router.post('/register', (req, res) => {
	// res.send('Registered user');
	console.log(req.body);
	User.register(new User({username: req.body.username}), req.body.password, (err,user) => {
		if(err) {
			console.log(err);
			return res.render('register');
		}
		passport.authenticate('local')(req, res, () => {
			res.redirect('/campgrounds');
		});
	});
});

router.get('/login', (req, res) => {
	res.render('login');
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/campgrounds',
	failureRedirect: '/login'
}), (req, res) => {});
	
router.get('/logout', (req,res) => {
	req.logout();
	res.redirect('/login');
});

function isLoggedIn(req, res, next) {
	console.log('isLoggedIn middleware');
	if(req.isAuthenticated()){
		console.log('Correct user');
		return next();
	}
	res.redirect('/login');
}

module.exports = router;
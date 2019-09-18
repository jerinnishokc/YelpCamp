var express = require('express');
var router = express.Router();
var campground = require('../models/campgrounds');
var comment = require('../models/comments');

router.get('/campgrounds/:id/comments/new', isLoggedIn, (req,res) => {
	campground.findById(
		req.params.id,
		(err, selectedCampground) => {
			if(err) {
				console.log(err);
			} else {
				//console.log(selectedCampground);
				res.render('newComment', {campground: selectedCampground});
			}
		}
	);
});

router.post('/campgrounds/:id/comments', (req,res) => {
	//console.log(req.body);
	
	campground.findById(
		req.params.id,
		(err, selectedCampground) => {
			if(err) {
				console.log(err);
			} else {
				comment.create(
					{
						text: req.body.comment.text,
						author: req.body.comment.author
					},
					(err, newComment) => {
						if(err) {
							console.log(err);
							res.redirect('/campgrounds');
						} else {
							//console.log(newComment);
							selectedCampground.comments.push(newComment);
							selectedCampground.save();
							res.redirect('/campgrounds/' + req.params.id);
						}
					}
				);
			}
		}
	);
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
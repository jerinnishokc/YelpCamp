var express = require('express');
var router = express.Router({mergeParams: true});
var campground = require('../models/campgrounds');
var comment = require('../models/comments');

router.get('/new', isLoggedIn, (req,res) => {
	campground.findById(
		req.params.id,
		(err, selectedCampground) => {
			if(err) {
				console.log(err);
			} else {
				//console.log(selectedCampground);
				res.render('./comment/new', {campground: selectedCampground});
			}
		}
	);
});

router.post('/', (req,res) => {
	//console.log(req.body);
	// console.log(req.user);	
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
							newComment.author.id = req.user._id;
							newComment.author.username = req.user.username;
							newComment.save();	
							//console.log(newComment);
							console.log(newComment);
							selectedCampground.comments.push(newComment);
							selectedCampground.save();
							console.log(selectedCampground);
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
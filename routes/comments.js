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

router.get('/:comment_id/edit', checkCommentOwnership, (req, res) => {
	campground.findById(
		req.params.id,
		(err, selectedCampground) => {
			if(err) {
				console.log(err);
			} else {
				comment.findById(
					req.params.comment_id,
					(err, foundComment) => {
						if(err) {
							console.log(err);
							res.redirect('/campgrounds');
						} else {
							res.render('./comment/edit', {campground: selectedCampground, comment: foundComment});
						}
					}
				);
			}
		}
	);
});

router.put('/:comment_id', checkCommentOwnership, (req, res) => {
	comment.findByIdAndUpdate(
		req.params.comment_id,
		req.body.comment,
		(err, updatedComment) => {
			if(err) {
				console.log(err);
				res.redirect('/campgrounds');
			} else {
				res.redirect('/campgrounds/' + req.params.id);
			}
		}
	);
});

router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
	comment.findByIdAndRemove(
		req.params.comment_id,
		(err, deletedComment) => {
			if(err) {
				console.log(err);
				res.redirect('/campgrounds');
			} else {
				res.redirect('/campgrounds/' + req.params.id);
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

function checkCommentOwnership(req, res, next) {
	if(req.isAuthenticated()) {
		comment.findById(
			req.params.comment_id,
			(err, foundComment) => {
				if(req.user._id.equals(foundComment.author.id)) {
					next();
				} else {
					res.redirect('back');	   
				}		
			}
		);
	} else {
		res.redirect('back');	   
    }
}
module.exports = router;
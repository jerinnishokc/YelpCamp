var express = require('express');
var campground = require('../models/campgrounds');
var router = express.Router();
// var expressBack = require('express-back');

// router.use(expressBack());

//Get all campgrounds
router.get('/', (req,res) => {
	console.log(req.user);
	campground.find(
		{}, 
		(err,allCampground) => {
			if(err) {
				console.log(err);
			} else {
				res.render('index', {campgrounds:allCampground});
			}
		}
	);
});

router.get('/new', isLoggedIn, (req,res) => {
	res.render('./campground/new');
});

router.post('/', isLoggedIn, (req,res) => {
	console.log(req.user);
	var newCampground = req.body;
	// console.log(req.body);
	
	// console.log(newCampground);
	//campgrounds.push(newCampground);
	
	campground.create(
		newCampground,
		(err,campground) => {
			if(err) {
				console.log(err);
			}
			else {
				campground.author.id = req.user._id;
				campground.author.username = req.user.username;
				campground.save();
				console.log(campground);
				res.redirect('/campgrounds');
			}
		}
	);
});

router.get('/:id', (req,res) => {
	//console.log(req.params.id);
	campground.findById(req.params.id).populate('comments').exec(
		(err,selectedCampground) => {
			if(err) {
				console.log(err);
			} else {
				//console.log(selectedCampground);
				res.render('./campground/show', {campground:selectedCampground});
			}
		}
	);
});

router.get('/:id/edit', checkCampgroundOwnership, (req,res) => {	
	campground.findById(
		req.params.id,
		(err,foundCampground) => {
			if(err) {
				console.log(err);
			}
			res.render('./campground/edit', {campground:foundCampground});		
		}
	);	
});

router.put('/:id', checkCampgroundOwnership, (req,res) => {
	console.log(req.body.campground);
	campground.findByIdAndUpdate(req.params.id,req.body.campground, (err, updatedCampground) => {
		// if(err) {
		// 	console.log(err);
		// 	res.redirect('/campgrounds');
		// }
		res.redirect('/campgrounds/' + req.params.id);
	});
});

router.delete('/:id', (req,res) => {
	campground.findByIdAndRemove(req.params.id, (err, deletedCampground) => {
		if(err) {
		 console.log(err);
			res.redirect('/campgrounds');
		}
		//console.log(deletedCampground);
		else {
			res.redirect('/campgrounds');
		}
	});
});

function isLoggedIn(req, res, next) {
	console.log('isLoggedIn middleware');
	if(req.isAuthenticated()){
		console.log('Correct user');
		return next();
	}
	res.redirect('/login');
}

function checkCampgroundOwnership(req, res, next) {
	console.log('Ownership middleware');
	if(req.isAuthenticated()){
		campground.findById(req.params.id, (err, foundCampground) => {
			if(err) {
				console.log(err);
				res.redirect('/campgrounds');
			} else {
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					res.redirect('back');
					// res.expressBack();
				}
			}
		});
	} else {
		console.log('Hit on back!!');
		res.redirect('back');
		// res.expressBack();
	}
}

module.exports = router;

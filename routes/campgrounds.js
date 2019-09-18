var express = require('express');
var campground = require('../models/campgrounds');
var router = express.Router();

//Get all campgrounds
router.get('/campgrounds', (req,res) => {
	//console.log(req.user);
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

router.get('/campgrounds/new', (req,res) => {
	res.render('newCampground');
});

router.post('/campgrounds', (req,res) => {
	var newCampground = req.body;
	//campgrounds.push(newCampground);
	campground.create(
		newCampground,
		(err,campground) => {
			if(err) {
				console.log(err);
			}
			else {
				res.redirect('/campgrounds');
			}
		}
	);
});

router.get('/campgrounds/:id', (req,res) => {
	//console.log(req.params.id);
	
	campground.findById(req.params.id).populate('comments').exec(
		(err,selectedCampground) => {
			if(err) {
				console.log(err);
			} else {
				//console.log(selectedCampground);
				res.render('show', {campground:selectedCampground});
			}
		}
	);
});

module.exports = router;

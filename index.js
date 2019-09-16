var express = require('express'),
	app = express(),
	request = require('request'),
	mongoose = require('mongoose'),
	campground = require('./models/campgrounds'),
	User = require('./models/users'),
	bodyParser = require('body-parser'),
	seedDB = require('./seeds'),
	comment = require('./models/comments'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	passportLocalMongoose = require('passport-local-mongoose');
	
//Establish a connection to the mongoDB
mongoose.connect('mongodb://localhost:27017/yelp_camp',{useNewUrlParser: true});

//=========================
// APP Configuration
//=========================
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(require('express-session')({
	secret: 'This is a secret message',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//Adding a middleware to all the routes
app.use(function(req,res,next){
	console.log('General middleware');
	res.locals.currentUser = req.user;
	next();
});

//=========================
// Seeding the DB
//=========================
seedDB();

//=========================
// Passport Configuration
//=========================
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=========================
// ROUTES
//=========================

//Landing page
app.get('/', (req,res) => {
	res.send('This is the index route');
});

//Get all campgrounds
app.get('/campgrounds', (req,res) => {
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

app.get('/campgrounds/new', (req,res) => {
	res.render('newCampground');
});

app.post('/campgrounds', (req,res) => {
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

app.get('/campgrounds/:id', (req,res) => {
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

//------------------------------------------------------
// COMMENTS ROUTE
//------------------------------------------------------

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req,res) => {
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

app.post('/campgrounds/:id/comments', (req,res) => {
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

//============================
// AUTH ROUTES
//============================

app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', (req, res) => {
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

app.get('/login', (req, res) => {
	res.render('login');
});

app.post('/login', passport.authenticate('local', {
	successRedirect: '/campgrounds',
	failureRedirect: '/login'
}), (req, res) => {});
	
app.get('/logout', (req,res) => {
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

app.listen(4000, () => {
	console.log('Server is started and is running at PORT 4000');
});
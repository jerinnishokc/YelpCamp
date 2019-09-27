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
	passportLocalMongoose = require('passport-local-mongoose'),
	methodOverride = require('method-override');
	// expressBack = require('express-back');
	
var campgroundRoute = require('./routes/campgrounds'),
	commentRoute = require('./routes/comments'),
	authRoute = require('./routes/auth');

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
app.use(methodOverride('_method'));
// app.use(expressBack());

//Adding a middleware to all the routes
app.use(function(req,res,next){
	console.log('General middleware');
	res.locals.currentUser = req.user;
	next();
});

//=========================
// Seeding the DB
//=========================
//seedDB();

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

app.use('/campgrounds',campgroundRoute);
app.use('/campgrounds/:id/comments',commentRoute);
app.use('/',authRoute);

app.listen(4000, () => {
	console.log('Server is started and is running at PORT 4000');
});
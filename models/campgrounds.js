var mongoose = require('mongoose');

var campgroundSchema = new mongoose.Schema({
	name: String,
	desc: String,
	url: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model('Campground', campgroundSchema);
var mongoose = require('mongoose');
var campground = require('./models/campgrounds');
var comment = require('./models/comments');

var data = [
		{
			name:'Alps', 
			url:'https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
			desc:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."			
		},
		{
			name:'Himalayas', 
			url:'https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
			desc:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
		},
		{
			name:'Rocky Mountains',
			url:'https://images.unsplash.com/photo-1496080174650-637e3f22fa03?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
			desc:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
		}		
	];

function seedDB() {
	
	campground.remove({},(err) => { //Deprivated function --> Use deleteOne, deleteMany or bulkWrite instead
		if(err){
			console.log(err);
		}
		console.log('removed campgrounds');
		data.forEach((seed) => {			
			campground.create(seed, (err,newCampground) => {
				if(err){
					console.log(err);
				} else {
					console.log('created campgrounds');
					//Creating comments
					comment.create(
						{
							text: 'This place is great!',
							author: 'Dravid'
						}, (err, comment) => {
							if(err) {
								console.log(err);
							} else {
								//console.log(comment);
								newCampground.comments.push(comment);
								newCampground.save((err,savedComment) => {
									if(err) {
										console.log(err);
									} else {
										console.log('comment pushed');
										//console.log(savedComment);
									}									
								});
							}							
						}
					);
				}
			});	
		});		
	});	
}

module.exports = seedDB;




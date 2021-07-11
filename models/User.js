const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	tdeenumber: {
		type: Number,
		required: false
	},
	ormnumber: {
		type: String,
		required: false
	},
	age:{
		type: Number,
		required: false
	},
	height:{
		type: Number,
		required: false
	},
	activitylevel:{
		type: String,
		required: false
	},
	weight:{
		type: Number,
		required: false
	},
	gender:{
		type: String,
		required: false
	},
	img:{
		type: String,
		required: false
	},
	wilks:{
		type: Number,
		required: false
	},
	total:{
		type: String,
		required: false
	},
	bio:{
		type: String
	},
	country:{
		type: String,
		required: true
	},
	joinDate:{
		type: Date,
		default: Date.now
	},
	profileComments: [
		{
			author:{
				type: String
			},
			text:{
				type: String
			},
			commentDate:{
				type: Date,
				default: Date.now
			}
		}
	],
	friendRequests: [
		{
			requestUsername: {
				type: String
			},
			requestDate: {
				type: Date,
				default: Date.now
			}
		}
	],
	friends: [
		{
			friendUsername:{
				type: String
			},
			acceptedDate: {
				type: Date,
				default: Date.now
			}
		}
	]
})

const User = mongoose.model('User', UserSchema);
module.exports = User;
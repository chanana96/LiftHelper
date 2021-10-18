const User = require('../models/User')
const Routine = require('../models/Routine')
const bcrypt = require('bcryptjs');
require('dotenv').config()
const { uploadFile } = require('../config/s3')

exports.viewprofile = async function (req, res){ //viewing your profile
	await User.findOne({
		username: req.params.username
	  }, async function (err, foundUser) {
		if (err) {
		  console.log("error")
		}
		await Routine.findOne({
			routineUsername: req.params.username
		}, function (err, routineUser){
			if (err) {
				console.log("error")
			  }
		res.render('profile', {
		  foundUser: foundUser,
		  matchingUser: req.user,
		  routineUser: routineUser,
		  date: foundUser.joinDate.toLocaleDateString(),
		  comment: foundUser.profileComments.sort((a, b) => b.commentDate - a.commentDate)
		});
	  })
	}
	)
}

exports.updateprofile = async (req, res)=>{ //update your profile
	try {
		req.isAuthenticated
			if (await req.user.username == req.params.username){
				res.render('update', {login: req.isAuthenticated, newProfile: req.user})
			}
			else{
				req.flash('error_msg', "You don't have permission to view that!");
				res.redirect('/')
			}
		}
	catch (error){
		req.flash('error_msg', "You don't have permission to view that!");
		res.redirect('/')
	}
}

exports.updatebio = async (req, res) =>{ //update bio
	try {
	await User.updateOne({username: req.params.username}, {$set: {bio: req.body.bio}})
	res.redirect('/users/profile/'+req.params.username)
	}
	catch (error){
		console.log(error)
		res.redirect('/')
	}
}

exports.profilecomment = async (req, res) =>{ //comment on profile
	try {
	await User.updateOne({username: req.params.username}, {$push: {profileComments: {author: req.user.username, text: req.body.text}}})
	res.redirect('/users/profile/'+req.params.username)
	}
	catch (error){
		console.log(error)
		res.redirect('/')
	}
}

exports.deleteprofilecomment = async (req, res) =>{ //delete profile comment
	try {
	await User.updateOne({username: req.params.username}, {$pull: {profileComments: {_id: req.params.commentid}}})
	res.redirect('/users/profile/'+req.params.username)
	}
	catch (error){
		console.log(error)
		res.redirect('/')
	}
}

exports.changepassword = async (req, res)=>{ //changing your password
	if(req.body.newpassword !== req.body.newpassword2){
		req.flash('error_msg', "Passwords don't match");
		res.redirect('/users/changepassword')
	}
	else{
	try {
		const userID = req.user._id
		const salt = await bcrypt.genSalt(10);
		const password = await bcrypt.hash(req.body.newpassword, salt);
		await User.updateOne({_id: userID}, {$set: {password: password}});
		req.flash('success_msg', 'Password changed');
		res.redirect('profile/'+req.user.username)
		}
		catch (error) {
		console.log('new password error')
		res.redirect('/')
		}
	}
}

exports.uploadprofilepicture = async function(req, res){ //upload profile picture
	User.updateOne({email: req.user.email}, 
		{$set: {img: req.file.filename}}, await uploadFile(req.file),
		function (err, user){
        if (err) return next(err);
        User.findById(req.user._id, function(err, user) {
            if (err) return next(err);
			req.flash('success_msg', 'Profile picture changed!');
            return res.redirect('/users/profile/'+req.user.username), {
			}
});
	})
}

exports.viewrecentposts = async (req, res)=>{ //show recent posts

	let userposts = await User.aggregate([
		{
			$lookup: {
				 from: "createposts", 
				 localField: "username", 
				 foreignField: "postUsername", 
				 as: "posts"
			}
		},
		{
			$unwind: "$posts"
		},
		{
			$match: {"posts.postUsername": req.params.username}
		},
		{
			$sort: {"posts.date": -1}
		} 
		])
	let start = (req.params.page-1) * 7
	let end = req.params.page * 7
	let result = userposts.slice(start, end)
	index = {}
	if (end<userposts.length){
	index.next = parseInt(req.params.page)+1
	}
	index.prev = parseInt(req.params.page)-1

	res.render('recentposts', {
	userposts: result}
	)
}
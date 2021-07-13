const User = require('../models/User');

exports.addfriend =async (req, res) => { //add friend
	try {
		await User.updateOne({username: req.params.username}, {$push: {friendRequests: {requestUsername: req.user.username}}})
		req.flash('success_msg', 'Added friend!')
		res.redirect('/users/profile/'+req.params.username)
	}
	catch (error){
		console.log(error)
		res.redirect('/')
	}
}

exports.viewfriendrequests = (req, res) =>{ //view friend requests
	res.render('friendrequests')
}

exports.acceptfriendrequests = async (req, res) =>{ //accept friend request
	try {
		await User.updateOne({username: req.user.username}, {$pull: {friendRequests: {requestUsername: req.params.acceptingname}}})
		await User.updateOne({username: req.user.username}, {$push: {friends: {friendUsername: req.params.acceptingname}} })
		await User.updateOne({username: req.params.acceptingname}, {$push: {friends: {friendUsername: req.user.username}} })
		req.flash('success_msg', 'Accepted friend!')
		res.redirect('/users/friendrequests')
	}
	catch (error){
		console.log(error)
		res.redirect('/')
	}
}

exports.deletefriend = async (req, res) => { //delete friend
	try {
		await User.updateOne({username: req.user.username}, {$pull: {friends: {friendUsername: req.params.username}}})
		await User.updateOne({username: req.params.username}, {$pull: {friends: {friendUsername: req.user.username}}})
		req.flash('success_msg', 'Deleted friend!')
		res.redirect('/users/profile/'+req.params.username)
	}
	catch (error){
		console.log(error)
		res.redirect('/')
	}
}
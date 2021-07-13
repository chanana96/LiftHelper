const User = require('../models/User');

exports.sendmessageui = async (req, res)=>{ //send a message ui
	res.render('message', {profile: await User.findOne({username: req.params.username})})
}

exports.sendmessage = async (req, res)=>{ //send a message
	let newMessage = {
	title: req.body.title,
	text: req.body.text,
	sender: req.user.username
	};
	try {
	if (req.file.filename.includes(".jpg") || req.file.filename.includes(".png") || req.file.filename.includes(".bmp") || req.file.filename.includes(".gif")){
	Object.assign(newMessage, {image: req.file.filename})
	}

	if (req.file.filename.includes(".mp4") || req.file.filename.includes(".mov") || req.file.filename.includes(".webm") || req.file.filename.includes(".wmv")
	|| req.file.filename.includes(".avi")){
	Object.assign(newMessage, {media: req.file.filename})
	}

	try {
		await User.updateOne({username: req.params.username}, {$push: {unreadMessages: newMessage}})
		res.redirect(`/users/profile/`+req.params.username)
	} catch (error){
		console.log(error)
		res.redirect('/')
	}
}	
catch (error){
try {
	await User.updateOne({username: req.params.username}, {$push: {unreadMessages: newMessage}})
	res.redirect(`/users/profile/`+req.params.username)
} catch (error){
	console.log(error)
	res.redirect('/')
}}}

exports.readmessages = async (req, res)=>{ //leave messages on read
	try{
		await User.findById(req.params.id, async function (err, user) {
			if (err) {
			  console.log("error")
			}
			user.unreadMessages.forEach(async message => 
				await User.updateOne({_id: req.params.id}, {$push: {readMessages: message}}),
				await User.updateOne({_id: req.params.id}, {$set: {unreadMessages: []}})
				)
		})
		res.redirect('/users/inbox')

	}
	catch(error){
		console.log(error)
		res.redirect('/')
	}
}

exports.viewunreadmessages = (req,res)=>{ //view unread messages
	res.render('inbox')
}

exports.viewreadmessages = (req, res) =>{ //view read messages
	res.render('old')
}
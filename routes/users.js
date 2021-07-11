const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Routine = require('../models/Routine');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const {ensureAuthenticated} = require('../config/auth');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function(request, file, callback){
		callback(null, './public/uploads/images');
	},

	filename: function(request, file, callback){
		callback(null, Date.now() + file.originalname)
	}
})

const upload = multer({
	storage: storage,
	limits:{
		fieldSize: 1024*1024*3,
	}
})

router.use(async function(req, res, next){

	try {
		res.locals.fr = await User.aggregate([
			{$match:{username: req.user.username}},	
			{$project: {
				frCount: {
				  $size: "$friendRequests"
				}
			  }}]),
		res.locals.login = req.isAuthenticated();
		res.locals.newProfile = req.user;
		next();
	}
	catch {
		res.locals.login = req.isAuthenticated();
		res.locals.newProfile = req.user;
		next();
	}

});

router.get('/register', (req,res)=>res.render('register', {login: req.isAuthenticated()}))
router.get('/login', (req,res)=>res.render('login', {login: req.isAuthenticated()}))
router.get('/changepassword', (req,res)=>res.render('changepassword', {newProfile: req.user, login: req.isAuthenticated()}))

router.get('/logout', (req, res)=>{
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/');
})

router.get ('/friendrequests', (req, res) =>{ //view friend requests
	res.render('friendrequests')
})
router.get('/profile/:username/update', async (req, res)=>{ //update your profile
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
})

router.post ('/friendrequests/:acceptingname', async (req, res) =>{ //accept friend request
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
})
router.post('/profile/:username/updatebio', async (req, res) =>{ //update bio
	try {
	await User.updateOne({username: req.params.username}, {$set: {bio: req.body.bio}})
	res.redirect('/users/profile/'+req.params.username)
	}
	catch (error){
		console.log(error)
		res.redirect('/')
	}
})

router.post('/profile/:username/comment', async (req, res) =>{ //comment on profile
	try {
	await User.updateOne({username: req.params.username}, {$push: {profileComments: {author: req.user.username, text: req.body.text}}})
	res.redirect('/users/profile/'+req.params.username)
	}
	catch (error){
		console.log(error)
		res.redirect('/')
	}
})

router.post('/profile/:username/addfriend', async (req, res) => { //add friend
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
)

router.post('/profile/:username/deletefriend', async (req, res) => { //delete friend
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
)

router.post('/profile/:username/:commentid/deletecomment', async (req, res) =>{ //delete profile comment
	try {
	await User.updateOne({username: req.params.username}, {$pull: {profileComments: {_id: req.params.commentid}}})
	res.redirect('/users/profile/'+req.params.username)
	}
	catch (error){
		console.log(error)
		res.redirect('/')
	}
})

router.get("/profile/:username", async function (req, res){ //viewing your profile
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
});

router.post('/changepassword', async (req, res)=>{ //changing your password
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
});


router.post('/profile/:username/update', upload.single('image'), function(req, res){ //upload profile picture
	User.updateOne({email: req.user.email}, 
		{$set: {img: req.file.filename}}, 
		function (err, user){
        if (err) return next(err);
        User.findById(req.user._id, function(err, user) {
            if (err) return next(err);
			req.flash('success_msg', 'Profile picture changed!');
            return res.redirect('/users/profile/'+req.user.username), {
			}
});
	})
})

router.post('/register', (req,res)=>{ //register
	const {username, name, email, country, gender, password, password2} = req.body;

	let errors = []

	if (!name || !email || !password || !password2 || !username || !country || !gender){
		errors.push({msg: "You didn't fill out all the forms!"});
	}

	if (password !== password2){
		errors.push({msg: "The passwords don't match!"});
	}
	if (password.length > 16){
		errors.push({msg: 'Your password needs to be 15 characters or less!'});
	}
	if (errors.length > 0){
		res.render('register', {errors, username, name, email, password, password2, login: req.isAuthenticated()}); //you need to declare login for layout.ejs here too
	}

	else{
		User.findOne({email:email}).then(user=>{if(user){
			errors.push({msg: "That email belongs to an existing user!"});
			res.render('register', {errors, username, name, email, country, gender, password, password2});
		}
		else{
			const newUser = new User({username, name, email, gender, country, password});
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
				  if (err) throw err;
				  newUser.password = hash;
				  newUser.save() 
				  	req.flash('success_msg', 'You are now registered and can log in!');
					res.redirect('/users/login');
				});
			});
		}})
	}
});

router.post('/login', (req, res, next)=>{
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: (	req.flash('error_msg', 'Wrong password!'), '/users/login')
	})(req, res, next);
});



module.exports = router;
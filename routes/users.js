const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const {ensureAuthenticated} = require('../config/auth');
const multer = require('multer')

const storage = multer.diskStorage({
	destination: function(request, file, callback){
		callback(null, './public/uploads/images');
	},

	filename: function(request, file, callback){
		callback(null, Date.now() + file.originalname)
	}
})
//add more routines
const upload = multer({
	storage: storage,
	limits:{
		fieldSize: 1024*1024*3,
	}
})

router.get('/register', (req,res)=>res.render('register', {login: req.isAuthenticated()}))
router.get('/login', (req,res)=>res.render('login', {login: req.isAuthenticated()}))
router.get('/changepassword', (req,res)=>res.render('changepassword', {newProfile: req.user, login: req.isAuthenticated()}))

router.get('/logout', (req, res)=>{
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/');
})


router.get("/profile/:id", ensureAuthenticated, function (req, res){ //viewing your profile
	const newProfile = req.user
	res.render('profile', {
	newProfile: newProfile,
	login: req.isAuthenticated()
	})
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
		res.redirect('profile/:id')
		}
		catch (error) {
		console.log('new password error')
		res.redirect('/')
		}
	}
});


router.post('/profile/:id', upload.single('image'), function(req, res){ //upload profile picture
	User.updateOne({email: req.user.email}, 
		{$set: {img: req.file.filename}}, 
		function (err, user){
        if (err) return next(err);
        User.findById(req.user._id, function(err, user) {
            if (err) return next(err);
			req.flash('success_msg', 'Profile picture changed!');
            return res.redirect('/users/profile/'+req.user.id), {
			}
});
	})
})

router.post('/register', (req,res)=>{ //register
	const {username, name, email, password, password2} = req.body;

	let errors = []

	if (!name || !email || !password || !password2 || !username){
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
			res.render('register', {errors, username, name, email, password, password2});
		}
		else{
			const newUser = new User({username, name, email, password});
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

router.get("/profiles/:username", function (req, res) { //viewing other profiles
	User.findOne({
	  username: req.params.username
	}, function (err, foundUser) {
	  if (err) {
		console.log("error")
	  }
	  res.render('profiles', {
		foundUser: foundUser,
		newProfile: req.user,
		login: req.isAuthenticated()
	  });
	})
});



module.exports = router;
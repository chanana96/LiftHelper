const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Routine = require('../models/Routine');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const {ensureAuthenticated} = require('../config/auth');
const multer = require('multer');
const messagesController = require('../controllers/messages');
const friendsController = require('../controllers/friends');
const profileController = require('../controllers/profile');


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
				},
				msgCount: {
					$size: "$unreadMessages"
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

router.get('/register', (req,res)=>res.render('register'))
router.get('/login', (req,res)=>res.render('login'))
router.get('/changepassword', (req,res)=>res.render('changepassword'))

router.get('/logout', (req, res)=>{
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/');
})


//view and comment on profile, update bio, change password and upload profile picture
router.get("/profile/:username", profileController.viewprofile);
router.get('/profile/:username/update', profileController.updateprofile)
router.get('/profile/:username/recentposts/:page', profileController.viewrecentposts)
router.post('/profile/:username/updatebio', profileController.updatebio)
router.post('/profile/:username/comment', profileController.profilecomment)
router.post('/profile/:username/:commentid/deletecomment', profileController.deleteprofilecomment)
router.post('/changepassword', profileController.changepassword);
router.post('/profile/:username/update', upload.single('image'), profileController.uploadprofilepicture)



//send, accept and delete friend requests
router.get ('/friendrequests', friendsController.viewfriendrequests)
router.post('/profile/:username/addfriend', friendsController.addfriend)
router.post ('/friendrequests/:acceptingname', friendsController.acceptfriendrequests)
router.post('/profile/:username/deletefriend', friendsController.deletefriend)


//direct message system between users
router.get('/profile/:username/message', messagesController.sendmessageui)
router.post('/profile/:username/message', upload.single('media'), messagesController.sendmessage)
router.post('/inbox/readall/:id', messagesController.readmessages)
router.get('/inbox', messagesController.viewunreadmessages)
router.get ('/inbox/old', messagesController.viewreadmessages)


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
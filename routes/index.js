const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const User = require('../models/User');
const Createpost = require('../models/Createpost');
const Vote = require('../models/Vote');
const multer = require('multer')
const forumController = require('../controllers/forum')

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


router.get('/', (req,res)=>res.render('homepage'));
router.get('/onerepmaxcalculator', (req,res)=>res.render('onerepmaxcalculator', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/tdeecalculator', (req,res)=>res.render('tdeecalculator', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/ibwcalculator', (req,res)=>res.render('ibwcalculator', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/wilkscalculator', (req,res)=>res.render('wilkscalculator', {login: req.isAuthenticated(), newProfile: req.user}));

router.post('/', (req, res) =>{ //search
	results = [[],[]]
	search = req.body.text
	let exercises = {
		"Barbell bench press": "/chest/barbellbenchpress", "Barbell squat": "/quadriceps/barbellsquat", "Incline bench press": "/chest/inclinebenchpress",
		"Hanging leg raise": "/abs/hanginglegraise", "Bicep curls": "/biceps/bicepcurls", "Calf raises": "/calves/calfraises", "Overhead press": "/frontdeltoids/overheadpress",
		"Shrugs": "/trapezius/shrugs"
	}

	for (exercise in exercises){
		if (exercise.toUpperCase().includes(search.toUpperCase())){
			results[0].push(exercise)
			results[1].push(exercises[exercise])
		}
	}
	res.render('results', {results: results, search: search, count: results[0].length})
})


router.get('/dashboard', ensureAuthenticated, (req,res)=> {
    res.render('dashboard', {login: req.isAuthenticated(), newProfile: req.user})
})

//view forum, create, edit, delete, like/dislike posts and comment/delete on posts
router.get('/forum/:start', forumController.forumpage);
router.get('/createpost', ensureAuthenticated, forumController.createpostui);
router.post('/createpost', upload.single('media'), forumController.createpost)
router.get('/editpost/:id', ensureAuthenticated, forumController.editpostui);
router.post('/editpost/:id', forumController.editpost)
router.get('/forum/view/:id/:page', forumController.viewpost)
router.post('/forum/:id', forumController.deletepost)
router.post('/forum/:id/comment', forumController.postcomment)
router.post('/forum/:postid/:commentid/deletecomment', forumController.deletecomment)
router.post('/forum/:id/like/', forumController.likepost)
router.post('/forum/:id/dislike/', forumController.dislikepost)

router.post('/wilkscalculator', function(req, res){
	User.updateOne({email: req.user.email}, {$set: {wilks: req.body.wilks, total: req.body.total}}, 
		function (err, user){
        if (err) return next(err);
        User.findById(req.user._id, function(err, user) {
            if (err) return next(err)
			req.flash('success_msg', 'Wilks score and total saved!')
            return res.redirect('/wilkscalculator'), {
			}
		});
	})
})

router.post('/tdeecalculator', function(req, res){
	User.updateOne({email: req.user.email}, 
		{$set: {tdeenumber: req.body.tdee, height: req.body.height, weight: req.body.weight, activitylevel: req.body.activity, age: req.body.age}}, 
		function (err, user){
        if (err) return next(err);
        User.findById(req.user._id, function(err, user) {
            if (err) return next(err)
			req.flash('success_msg', 'TDEE saved!')
            return res.redirect('/tdeecalculator'), {
			}
		});
	})
})

router.post('/onerepmaxcalculator', function(req, res){
	User.updateOne({email: req.user.email}, {$set: {ormnumber: req.body.compound + " - " + req.body.result}},
	function (err, user){
        if (err) return next(err);
        User.findById(req.user._id, function(err, user) {
            if (err) return next(err);
			req.flash('success_msg', 'One rep max saved!')
            return res.redirect('/onerepmaxcalculator'), {
			}
});
	})
})


module.exports = router;
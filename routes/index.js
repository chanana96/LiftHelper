const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const User = require('../models/User');
const Createpost = require('../models/Createpost');
const Vote = require('../models/Vote');
const multer = require('multer')

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

router.get('/', (req,res)=>res.render('homepage', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/onerepmaxcalculator', (req,res)=>res.render('onerepmaxcalculator', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/tdeecalculator', (req,res)=>res.render('tdeecalculator', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/ibwcalculator', (req,res)=>res.render('ibwcalculator', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/wilkscalculator', (req,res)=>res.render('wilkscalculator', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/createpost', ensureAuthenticated, (req,res)=>res.render('createpost', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/editpost/:id', ensureAuthenticated, async (req,res)=>res.render('editpost', {login: req.isAuthenticated(), newPost: await Createpost.findById(req.params.id),
	 newProfile: req.user}));



router.get('/forum', async (req,res)=>res.render('forum', { //view posts
    newPost: await Createpost.aggregate([
{
    $lookup: {
         from: "users", 
         localField: "postUsername", 
         foreignField: "username", 
         as: "postUser"
    }
},
{
    $sort: {date: -1}
}  
]), login: req.isAuthenticated(), 
newProfile: req.user
}));


router.get('/dashboard', ensureAuthenticated, (req,res)=> {
    res.render('dashboard', {login: req.isAuthenticated(), newProfile: req.user})
})

router.get('/forum/:id', async (req,res)=>{ //view post 
    const newPost = await Createpost.findById(req.params.id)
    res.render('show', {comment: newPost.comments.sort((a, b) => b.commentDate - a.commentDate), newPost: newPost, login: req.isAuthenticated(), newProfile: req.user})
})

router.post('/createpost', upload.single('media'), async (req,res)=> { //create post
	let newPost
	if (req.file.filename.includes(".jpg") || req.file.filename.includes(".png") || req.file.filename.includes(".bmp") || req.file.filename.includes(".gif")){
    	newPost = new Createpost({
			postTitle: req.body.title,
			postText: req.body.text,
			postUsername: req.user.username,
			image: req.file.filename
    });
	}	
	else {
		newPost = new Createpost({
			postTitle: req.body.title,
			postText: req.body.text,
			postUsername: req.user.username,
			media: req.file.filename
		});
	}
    try {
        newPost = await newPost.save()
        res.redirect(`/forum/${newPost.id}`)
    } catch (error){
        console.log(error)
        res.render('createpost', {newPost: newPost})
    }

})

router.post('/editpost/:id', async function(req, res){ //edit post
	const editPost = await Createpost.findById(req.params.id)
	Createpost.updateOne({_id: editPost}, {$set: {postText: req.body.text}}, 
		function (err, user){
        if (err) return next(err);
        User.findById(req.user._id, function(err, user) {
            if (err) return next(err)
			req.flash('success_msg', 'Post edited!')
            return res.redirect('/forum'), {
			}
		});
	})
})

router.post('/forum/:id', async (req,res) =>{ //delete post
    await Createpost.findByIdAndDelete(req.params.id)
	req.flash('success_msg', 'Post deleted')
    res.redirect('/forum')
})

router.post('/forum/:id/comment', async function(req, res){ //comment on post
	const commentPost = await Createpost.findById(req.params.id)
	Createpost.updateOne({_id: commentPost}, {$push: { comments: {author: req.user.username, text: req.body.text}}}, 
		function (err, user){
        if (err) return next(err);
        User.findById(req.user._id, function(err, user) {
            if (err) return next(err)
			req.flash('success_msg', 'Comment added')
            return res.redirect('/forum/'+commentPost._id), {
			}
		});
	})
})

router.post('/forum/:postid/:commentid/deletecomment', async function(req, res){ //delete comment
	await Createpost.updateOne( {_id: req.params.postid}, { $pull: { comments: { _id: req.params.commentid } } }, //needs await here
        function (err, user) {
            if (err) return next(err)
			req.flash('success_msg', 'Comment deleted')
            return res.redirect('/forum/' + req.params.postid), {
			}
		});
})

router.post('/forum/:id/like/', async (req,res) =>{ //like post
	const likePost = await Createpost.findById(req.params.id)

	let voteInfo = new Vote({
        voteEmail: req.user.email,
        votePost: likePost._id,
    });

	let votes = await Vote.find({voteEmail: req.user.email, votePost: likePost._id});

	if (votes.length>0){
		req.flash('error_msg', 'You already voted!')
		res.redirect ('/forum')
	}
	else if (req.user.username == likePost.postUsername){
		req.flash('error_msg', "You can't vote for your own post!")
		res.redirect ('/forum')
	}
	else{
	Createpost.updateOne({_id: likePost}, {$inc: {likeCount:1}}, 
		function (err, user){
        if (err) return next(err);
        User.findById(req.user._id, function(err, user) {
            if (err) return next(err)
			voteInfo = voteInfo.save()
			req.flash('success_msg', 'Post liked!')
            return res.redirect('/forum'), {
			}
		});
			})
		}
})

router.post('/forum/:id/dislike/', async (req,res) =>{ //dislike post
	const dislikePost = await Createpost.findById(req.params.id)

	let voteInfo = new Vote({
        voteEmail: req.user.email,
        votePost: dislikePost._id,
    });

	let votes = await Vote.find({voteEmail: req.user.email, votePost: dislikePost._id});

	if (votes.length>0){
		req.flash('error_msg', 'You already voted!')
		res.redirect ('/forum')
	}
	else if (req.user.username == dislikePost.postUsername){
		req.flash('error_msg', "You can't vote for your own post!")
		res.redirect ('/forum')
	}

	else{
	Createpost.updateOne({_id: dislikePost}, {$inc: {likeCount:-1}}, 
		function (err, user){
        if (err) return next(err);
        User.findById(req.user._id, function(err, user) {
            if (err) return next(err)
			voteInfo = voteInfo.save()
			req.flash('success_msg', 'Post disliked!')
            return res.redirect('/forum'), {
			}
		});
		})
		}
})

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
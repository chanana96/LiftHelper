const Createpost = require('../models/Createpost')
const Vote = require('../models/Vote')
const User = require('../models/User')

exports.forumpage = async (req,res)=>res.render('forum', { //main forum page
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
})

exports.createpost = async (req,res)=> { //create post
	let newPost = await new Createpost({
		postTitle: req.body.title,
		postText: req.body.text,
		postUsername: req.user.username
});
	try {
		if (req.file.filename.includes(".jpg") || req.file.filename.includes(".png") || req.file.filename.includes(".bmp") || req.file.filename.includes(".gif")){
		Object.assign(newPost, {image: req.file.filename})
		}

		if (req.file.filename.includes(".mp4") || req.file.filename.includes(".mov") || req.file.filename.includes(".webm") || req.file.filename.includes(".wmv")
		|| req.file.filename.includes(".avi")){
		Object.assign(newPost, {media: req.file.filename})
		}

		try {
			newPost = await newPost.save()
			res.redirect(`/forum/${newPost.id}`)
		} catch (error){
			console.log(error)
			res.render('createpost', {newPost: newPost})
		}
	}	
	catch (error){

    try {
        newPost = await newPost.save()
        res.redirect(`/forum/${newPost.id}`)
    } catch (error){
        console.log(error)
        res.render('createpost', {newPost: newPost})
    }
	}	
}

exports.viewpost = async (req,res)=>{ //view post 
    const newPost = await Createpost.findById(req.params.id)
    res.render('show', {comment: newPost.comments.sort((a, b) => b.commentDate - a.commentDate), newPost: newPost, login: req.isAuthenticated(), newProfile: req.user})
}

exports.editpostui = async (req,res)=>res.render('editpost', {login: req.isAuthenticated(), newPost: await Createpost.findById(req.params.id), //edit post ui
	newProfile: req.user})

exports.editpost = async function(req, res){ //edit post
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
}

exports.createpostui = (req,res)=>res.render('createpost', {login: req.isAuthenticated(), newProfile: req.user}) //create post ui

exports.deletepost = async (req,res) =>{ //delete post
    await Createpost.findByIdAndDelete(req.params.id)
	req.flash('success_msg', 'Post deleted')
    res.redirect('/forum')
}

exports.postcomment = async function(req, res){ //comment on post
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
}

exports.deletecomment = async function(req, res){ //delete comment
	await Createpost.updateOne( {_id: req.params.postid}, { $pull: { comments: { _id: req.params.commentid } } }, //needs await here
        function (err, user) {
            if (err) return next(err)
			req.flash('success_msg', 'Comment deleted')
            return res.redirect('/forum/' + req.params.postid), {
			}
		});
}

exports.likepost = async (req,res) =>{ //like post
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
}

exports.dislikepost = async (req,res) =>{ //dislike post
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
}

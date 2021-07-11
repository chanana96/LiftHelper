module.exports = {
	ensureAuthenticated: function(req, res, next){
		if (req.isAuthenticated()){
			return next();
		}
		req.flash('error_msg', "You must be logged in to do that!")
		res.redirect('/users/login')
	}
}
const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
	voteEmail: {
		type: String,
		required: false
	},
	votePost:{
		type: String,
		required: false
	}
})

const Vote = mongoose.model('Vote', VoteSchema);
module.exports = Vote;
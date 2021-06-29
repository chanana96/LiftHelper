const mongoose = require('mongoose');

const CreatepostSchema = new mongoose.Schema({
	postTitle: {
		type: String,
		required: true
	},
	postText: {
		type: String,
		required: true
	},
	date: {
        type: Date,
        default: Date.now
    },
	postUsername:{
		type: String,
		required: true
	},
	likeCount: {
		type: Number,
		required: false
	},
	comments: [
		{
			author:{
				type: String
			},
			text:{
				type: String
			},
			commentDate:{
				type: Date,
				default: Date.now
			}
		}
	]
})

const Createpost = mongoose.model('Createpost', CreatepostSchema);
module.exports = Createpost;
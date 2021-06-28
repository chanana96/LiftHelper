const mongoose = require('mongoose');

const FitnessSchema = new mongoose.Schema({
	onerepmax: {
		type: Number,
		required: false
	},
	tdeestat: {
		type: Number,
		required: false
	}
	
})

const Fitness = mongoose.model('Fitness', FitnessSchema);
module.exports = Fitness;
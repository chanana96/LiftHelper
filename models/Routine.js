const mongoose = require('mongoose');

const RoutineSchema = new mongoose.Schema({
	Monday: {
		type: String,
	},
	Tuesday:{
		type: String,
	},
	Wednesday: {
		type: String,
	},
	Thursday: {
		type: String,
	},
	Friday: {
		type: String,
	},
	Saturday: {
		type: String,
	},
	Sunday: {
		type: String,
	},
	routineUsername:{
		type: String
	}
})

const Routine = mongoose.model('Routine', RoutineSchema);
module.exports = Routine;
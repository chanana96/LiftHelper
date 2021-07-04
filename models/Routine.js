const mongoose = require('mongoose');

const RoutineSchema = new mongoose.Schema({
	routineName:{
		type: String
	},
	routineUsername:{
		type: String
	},
	routineDate:{
		type: Date,
		default: Date.now
	},
	routine:[
		{
			monday: [
				{
					exercise: {
						type: String
					}
				}
			],
			tuesday:[
				{
					exercise: {
						type: String
					}
				}
			],
			wednesday: [
				{
					exercise: {
						type: String
					}
				}
			],
			thursday: [
				{
					exercise: {
						type: String
					}
				}
			],
			friday: [
				{
					exercise: {
						type: String
					}
				}
			],
			saturday: [
				{
					exercise: {
						type: String
					}
				}
			],
			sunday: [
				{
					exercise: {
						type: String
					}
				}
			],
		}
	]
})

const Routine = mongoose.model('Routine', RoutineSchema);
module.exports = Routine;
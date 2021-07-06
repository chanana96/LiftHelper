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
	monday: [
		{
			exercise: {
				type: String
			},
			link:{
				type: String
			}
		}
	],
	tuesday:[
		{
			exercise: {
				type: String
			},
			link:{
				type: String
			}
		}
	],
	wednesday: [
		{
			exercise: {
				type: String
			},
			link:{
				type: String
			}
		}
	],
	thursday: [
		{
			exercise: {
				type: String
			},
			link:{
				type: String
			}
		}
	],
	friday: [
		{
			exercise: {
				type: String
			},
			link:{
				type: String
			}
		}
	],
	saturday: [
		{
			exercise: {
				type: String
			},
			link:{
				type: String
			}
		}
	],
	sunday: [
		{
			exercise: {
				type: String
			},
			link:{
				type: String
			}
		}
	],

})

const Routine = mongoose.model('Routine', RoutineSchema);
module.exports = Routine;
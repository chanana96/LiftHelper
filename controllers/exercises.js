const Routine = require('../models/Routine');

exports.hanginglegraise = async (req, res) =>{
	let day = req.body.day
	try{
	await Routine.updateOne( {routineUsername: req.user.username}, { $push: { [day]: { exercise: "Hanging leg raise", link: "abs/hanginglegraise" } } } )
	req.flash('success_msg', 'Exercise added to routine!')
	res.redirect('/muscles/abs/hanginglegraise')
	}
	catch(error){
		console.log(error)
	}	
}

exports.bicepcurls = async (req, res) =>{
	let day = req.body.day
	try{
	await Routine.updateOne( {routineUsername: req.user.username}, { $push: { [day]: { exercise: "Bicep curls", link: "biceps/bicepcurls" } } } )
	req.flash('success_msg', 'Exercise added to routine!')
	res.redirect('/muscles/biceps/bicepcurls')
	}
	catch(error){
		console.log(error)
	}	
}

exports.calfraises = async (req, res) =>{
	let day = req.body.day
	try{
	await Routine.updateOne( {routineUsername: req.user.username}, { $push: { [day]: { exercise: "Calf raises", link: "calves/calfraises" } } } )
	req.flash('success_msg', 'Exercise added to routine!')
	res.redirect('/muscles/calves/calfraises')
	}
	catch(error){
		console.log(error)
	}	
}

exports.barbellbenchpress = async (req, res) =>{
	let day = req.body.day
	try{
	await Routine.updateOne( {routineUsername: req.user.username}, { $push: { [day]: { exercise: "Barbell bench press", link: "chest/barbellbenchpress" } } } )
	req.flash('success_msg', 'Exercise added to routine!')
	res.redirect('/muscles/chest/barbellbenchpress')
	}
	catch(error){
		console.log(error)
	}	
}

exports.inclinebenchpress = async (req, res) =>{
	let day = req.body.day
	try{
	await Routine.updateOne( {routineUsername: req.user.username}, { $push: { [day]: { exercise: "Incline bench press", link: "chest/inclinebenchpress" } } } )
	req.flash('success_msg', 'Exercise added to routine!')
	res.redirect('/muscles/chest/inclinebenchpress')
	}
	catch(error){
		console.log(error)
	}	
}

exports.overheadpress = async (req, res) =>{
	let day = req.body.day
	try{
	await Routine.updateOne( {routineUsername: req.user.username}, { $push: { [day]: { exercise: "Overhead press", link: "frontdeltoids/overheadpress" } } } )
	req.flash('success_msg', 'Exercise added to routine!')
	res.redirect('/muscles/frontdeltoids/overheadpress')
	}
	catch(error){
		console.log(error)
	}	
}

exports.barbellsquat = async (req, res) =>{
	let day = req.body.day
	try{
	await Routine.updateOne( {routineUsername: req.user.username}, { $push: { [day]: { exercise: "Barbell squat", link: "quadriceps/barbellsquat" } } } )
	req.flash('success_msg', 'Exercise added to routine!')
	res.redirect('/muscles/quadriceps/barbellsquat')
	}
	catch(error){
		console.log(error)
	}	
}

exports.shrugs = async (req, res) =>{
	let day = req.body.day
	try{
	await Routine.updateOne( {routineUsername: req.user.username}, { $push: { [day]: { exercise: "Shrugs", link: "trapezius/shrugs" } } } )
	req.flash('success_msg', 'Exercise added to routine!')
	res.redirect('/muscles/trapezius/shrugs')
	}
	catch(error){
		console.log(error)
	}	
}
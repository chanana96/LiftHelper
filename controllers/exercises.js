const Routine = require('../models/Routine');

exports.add = async (req, res) =>{ //add exercise from add page
	let day = req.params.day
	updatePayload = []

	if (req.body.bbp){
		updatePayload.push({exercise: req.body.bbp.split(',')[0], link: req.body.bbp.split(',')[1]})
	}
	if (req.body.shrugs){
		updatePayload.push({exercise: req.body.shrugs.split(',')[0], link: req.body.shrugs.split(',')[1]})
	}
	if (req.body.incline){
		updatePayload.push({exercise: req.body.incline.split(',')[0], link: req.body.incline.split(',')[1]})
	}
	if (req.body.hlr){
		updatePayload.push({exercise: req.body.hlr.split(',')[0], link: req.body.hlr.split(',')[1]})
	}
	if (req.body.curls){
		updatePayload.push({exercise: req.body.curls.split(',')[0], link: req.body.curls.split(',')[1]})
	}
	if (req.body.calfraise){
		updatePayload.push({exercise: req.body.calfraise.split(',')[0], link: req.body.calfraise.split(',')[1]})
	}
	if (req.body.ohp){
		updatePayload.push({exercise: req.body.ohp.split(',')[0], link: req.body.ohp.split(',')[1]})
	}
	if (req.body.squats){
		updatePayload.push({exercise: req.body.squats.split(',')[0], link: req.body.squats.split(',')[1]})
	}
	try{
	await Routine.updateOne( {routineUsername: req.user.username}, { $push: { [day]: {$each: updatePayload} } } )
	req.flash('success_msg', 'Exercise added to routine!')
	res.redirect('/muscles/routines/'+req.user.username)
	}
	catch(error){
		console.log(error)
	}	
}

//adding exercises to routine
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


//exercise deletions
exports.mondaydelete = async (req, res)=>{ 
	try{
	await Routine.updateOne( {routineUsername: req.params.username}, { $pull: { monday: { _id: req.params.id } } })
		req.flash('success_msg', 'Exercise deleted!')
		res.redirect('/muscles/routines/'+req.params.username)
	}
	catch(error){
		console.log(error)
		res.redirect('/')
	}

}

exports.tuesdaydelete = async (req, res)=>{ 
	try{
	await Routine.updateOne( {routineUsername: req.params.username}, { $pull: { tuesday: { _id: req.params.id } } })
	req.flash('success_msg', 'Exercise deleted!')
	res.redirect('/muscles/routines/'+req.params.username)
	}
	catch(error){
		console.log(error)
		res.redirect('/')
	}

}

exports.wednesdaydelete = async (req, res)=>{ 
	try{
	await Routine.updateOne( {routineUsername: req.params.username}, { $pull: { wednesday: { _id: req.params.id } } })
	req.flash('success_msg', 'Exercise deleted!')
	res.redirect('/muscles/routines/'+req.params.username)
	}
	catch(error){
		console.log(error)
		res.redirect('/')
	}

}

exports.thursdaydelete = async (req, res)=>{ 
	try{
	await Routine.updateOne( {routineUsername: req.params.username}, { $pull: { thursday: { _id: req.params.id } } })
	req.flash('success_msg', 'Exercise deleted!')
	res.redirect('/muscles/routines/'+req.params.username)
	}
	catch(error){
		console.log(error)
		res.redirect('/')
	}

}

exports.fridaydelete = async (req, res)=>{ 
	try{
	await Routine.updateOne( {routineUsername: req.params.username}, { $pull: { friday: { _id: req.params.id } } })
	req.flash('success_msg', 'Exercise deleted!')
	res.redirect('/muscles/routines/'+req.params.username)
	}
	catch(error){
		console.log(error)
		res.redirect('/')
	}

}

exports.saturdaydelete = async (req, res)=>{ 
	try{
	await Routine.updateOne( {routineUsername: req.params.username}, { $pull: { saturday: { _id: req.params.id } } })
	req.flash('success_msg', 'Exercise deleted!')
	res.redirect('/muscles/routines/'+req.params.username)
	}
	catch(error){
		console.log(error)
		res.redirect('/')
	}

}

exports.sundaydelete = async (req, res)=>{ 
	try{
	await Routine.updateOne( {routineUsername: req.params.username}, { $pull: { sunday: { _id: req.params.id } } })
	req.flash('success_msg', 'Exercise deleted!')
	res.redirect('/muscles/routines/'+req.params.username)
	}
	catch(error){
		console.log(error)
		res.redirect('/')
	}

}
const Routine = require('../models/Routine');

//set premade routine to user routine
exports.redditppl = async (req, res) =>{
	try{
	await Routine.updateOne( {routineUsername: req.user.username}, { $push: { ['monday']: {$each: [
	{ exercise: "Deadlift", link: "lowerback/deadlift" }, 
	{ exercise: "Lat pulldown", link: "lats/latpulldown"},
	{ exercise: "Chest supported row", link: "lats/chestsupportedrow"},
	{ exercise: "Face pulls", link: "reardeltoids/facepulls"},
	{ exercise: "Bicep curls", link: "biceps/bicepcurls"},
	{ exercise: "Hammer curls", link: "biceps/hammercurls"}
]},
['tuesday']: {$each: [
	{ exercise: "Barbell bench press", link: "chest/barbellbenchpress"},
	{ exercise: "Overhead press", link: "frontdeltoids/overheadpress"},
	{ exercise: "Incline bench press", link: "chest/inclinebenchpress"},
	{ exercise: "Tricep pushdown", link: "triceps/triceppushdown"},
	{ exercise: "Tricep extensions", link: "triceps/tricepextensions"},
	{ exercise: "Lateral raises", link: "frontdeltoids/lateralraises"},
]},
['wednesday']: {$each: [
	{ exercise: "Barbell squat", link: "quadriceps/barbellsquat"},
	{ exercise: "Romanian deadlift", link: "hamstrings/romaniandeadlift"},
	{ exercise: "Leg press", link: "quadriceps/legpress"},
	{ exercise: "Leg curls", link: "quadriceps/legcurls"},
	{ exercise: "Calf raises", link: "calves/calfraises"},
]},
['thursday']: {$each: [
	{ exercise: "Barbell row", link: "lats/barbellrow" }, 
	{ exercise: "Lat pulldown", link: "lats/latpulldown"},
	{ exercise: "Chest supported row", link: "lats/chestsupportedrow"},
	{ exercise: "Face pulls", link: "reardeltoids/facepulls"},
	{ exercise: "Bicep curls", link: "biceps/bicepcurls"},
	{ exercise: "Hammer curls", link: "biceps/hammercurls"}
]},
['friday']: {$each: [
	{ exercise: "Overhead press", link: "frontdeltoids/overheadpress"},
	{ exercise: "Barbell bench press", link: "chest/barbellbenchpress"},
	{ exercise: "Incline bench press", link: "chest/inclinebenchpress"},
	{ exercise: "Tricep pushdown", link: "triceps/triceppushdown"},
	{ exercise: "Tricep extensions", link: "triceps/tricepextensions"},
	{ exercise: "Lateral raises", link: "frontdeltoids/lateralraises"},
]},
['saturday']: {$each: [
	{ exercise: "Barbell squat", link: "quadriceps/barbellsquat"},
	{ exercise: "Romanian deadlift", link: "hamstrings/romaniandeadlift"},
	{ exercise: "Leg press", link: "quadriceps/legpress"},
	{ exercise: "Leg curls", link: "quadriceps/legcurls"},
	{ exercise: "Calf raises", link: "calves/calfraises"},
]}
 } } )
	req.flash('success_msg', 'Routine added!')
	res.redirect('/muscles/routines/redditppl')
	}
	catch(error){
		console.log(error)
	}	
}

exports.ftoforbeginners = async (req, res) =>{
	try{
	await Routine.updateOne( {routineUsername: req.user.username}, { $push: { ['monday']: {$each: [
	{ exercise: "Barbell bench press", link: "chest/barbellbenchpress" }, 
	{ exercise: "Barbell squat", link: "quadriceps/barbellsquat"},
]},
['wednesday']: {$each: [
	{ exercise: "Deadlift", link: "lowerback/deadlift"},
	{ exercise: "Overhead press", link: "frontdeltoids/overheadpress"},
]},
['friday']: {$each: [
	{ exercise: "Barbell squat", link: "quadriceps/barbellsquat"},
	{ exercise: "Barbell bench press", link: "chest/barbellbenchpress" }, 
]}
 } } )
	req.flash('success_msg', 'Routine added!')
	res.redirect('/muscles/routines/531forbeginners')
	}
	catch(error){
		console.log(error)
	}	
}



exports.addui = async (req, res) => //add routines page
	res.render('muscles/routines/add', {login: req.isAuthenticated(), newProfile: req.user, day: req.params.day})

exports.viewroutine = async (req, res)=>{ //view your routine
	await Routine.findOne({routineUsername:req.params.username},(error, routine)=>{
		if (error){
			console.log(error)
			res.redirect('/')
		}
	res.render('muscles/routines/userroutine', {login: req.isAuthenticated(), newProfile: req.user, routine: routine
	})})
}

exports.makeroutine = async (req,res)=> { //initialize routine

	await Routine.findOne({routineUsername:req.user.username}).then(user=>{if(user){
		req.flash('error_msg', "You already have an existing routine!");
		res.redirect('/muscles/routines/'+req.user.username);
	}
	else{
			routine = new Routine({
			routineName: req.body.name,
			routineUsername: req.user.username
		});	
		routine.save()
		req.flash('success_msg', "Routine created!");
		res.redirect('/muscles/routines/routines')
	}})

}

exports.deleteroutine = async (req,res)=> { //delete routine
	req.params.username = req.user.username
	try {
	await Routine.findOneAndDelete({routineUsername:req.user.username})
	req.flash('success_msg', "Routine succesfully deleted!")
	res.redirect('/')
	}
	catch (error){
		req.flash('error_msg', "error")
		res.redirect('/')
	}

}


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
	if (req.body.hammercurls){
		updatePayload.push({exercise: req.body.hammercurls.split(',')[0], link: req.body.hammercurls.split(',')[1]})
	}
	if (req.body.lateralraises){
		updatePayload.push({exercise: req.body.lateralraises.split(',')[0], link: req.body.lateralraises.split(',')[1]})
	}
	if (req.body.romaniandeadlift){
		updatePayload.push({exercise: req.body.romaniandeadlift.split(',')[0], link: req.body.romaniandeadlift.split(',')[1]})
	}
	if (req.body.barbellrow){
		updatePayload.push({exercise: req.body.barbellrow.split(',')[0], link: req.body.barbellrow.split(',')[1]})
	}
	if (req.body.chestsupportedrow){
		updatePayload.push({exercise: req.body.chestsupportedrow.split(',')[0], link: req.body.chestsupportedrow.split(',')[1]})
	}
	if (req.body.latpulldown){
		updatePayload.push({exercise: req.body.latpulldown.split(',')[0], link: req.body.latpulldown.split(',')[1]})
	}
	if (req.body.deadlift){
		updatePayload.push({exercise: req.body.deadlift.split(',')[0], link: req.body.deadlift.split(',')[1]})
	}
	if (req.body.legcurls){
		updatePayload.push({exercise: req.body.legcurls.split(',')[0], link: req.body.legcurls.split(',')[1]})
	}
	if (req.body.legpress){
		updatePayload.push({exercise: req.body.legpress.split(',')[0], link: req.body.legpress.split(',')[1]})
	}
	if (req.body.facepulls){
		updatePayload.push({exercise: req.body.facepulls.split(',')[0], link: req.body.facepulls.split(',')[1]})
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


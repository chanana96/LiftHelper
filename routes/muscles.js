const express = require('express')
const router = express.Router();
const User = require('../models/User');
const Routine = require('../models/Routine');
const {ensureAuthenticated} = require('../config/auth');
const mongoose  = require('mongoose');
const exercisesController = require('../controllers/exercises');

router.use(async function(req, res, next){

	try {
		res.locals.fr = await User.aggregate([
			{$match:{username: req.user.username}},	
			{$project: {
				frCount: {
				  $size: "$friendRequests"
				},
				msgCount: {
					$size: "$unreadMessages"
				}
			  }}]),
		res.locals.login = req.isAuthenticated();
		res.locals.newProfile = req.user;
		next();
	}
	catch {
		res.locals.login = req.isAuthenticated();
		res.locals.newProfile = req.user;
		next();
	}

});

//main muscles
router.get('/chest', (req, res)=>res.render('muscles/chest/chest', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/abs', (req, res)=>res.render('muscles/abs/abs', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/biceps', (req, res)=>res.render('muscles/biceps/biceps', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/frontdeltoids', (req, res)=>res.render('muscles/frontdeltoids/frontdeltoids', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/quadriceps', (req, res)=>res.render('muscles/quadriceps/quadriceps', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/trapezius', (req, res)=>res.render('muscles/trapezius/trapezius', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/calves', (req, res)=>res.render('muscles/calves/calves', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/forearms', (req, res)=>res.render('muscles/forearms/forearms', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/glutes', (req, res)=>res.render('muscles/glutes/glutes', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/hamstrings', (req, res)=>res.render('muscles/hamstrings/hamstrings', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/lats', (req, res)=>res.render('muscles/lats/lats', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/lowerback', (req, res)=>res.render('muscles/lowerback/lowerback', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/triceps', (req, res)=>res.render('muscles/triceps/triceps', {login: req.isAuthenticated(), newProfile: req.user}));

//exercises
router.get('/abs/hanginglegraise', (req, res)=>res.render('muscles/abs/hanginglegraise', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/biceps/bicepcurls', (req, res)=>res.render('muscles/biceps/bicepcurls', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/calves/calfraises', (req, res)=>res.render('muscles/calves/calfraises', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/chest/barbellbenchpress', (req, res)=>res.render('muscles/chest/barbellbenchpress', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/chest/inclinebenchpress', (req, res)=>res.render('muscles/chest/inclinebenchpress', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/frontdeltoids/overheadpress', (req, res)=>res.render('muscles/frontdeltoids/overheadpress', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/quadriceps/barbellsquat', (req, res)=>res.render('muscles/quadriceps/barbellsquat', {login: req.isAuthenticated(), newProfile: req.user}));
router.get('/trapezius/shrugs', (req, res)=>res.render('muscles/trapezius/shrugs', {login: req.isAuthenticated(), newProfile: req.user}));

//routines
router.get('/routines/routines', (req, res)=>res.render('muscles/routines/routines', {login: req.isAuthenticated(), newProfile: req.user }));
router.get('/routines/531forbeginners', (req, res)=>res.render('muscles/routines/531forbeginners', {login: req.isAuthenticated(), newProfile: req.user}));

//personalized routines system
router.get('/routines/:username/:day', exercisesController.addui) // add exercise(s) on x day ui
router.get('/routines/:username', exercisesController.viewroutine);
router.post('/routines/:username/:day', exercisesController.add) // add exercise(s) on x day
router.post('/routines/routines', ensureAuthenticated, exercisesController.makeroutine)
router.post('/routines/:username', exercisesController.deleteroutine)

//delete exercises
router.post('/routines/:username/:id/monday_delete/', exercisesController.mondaydelete)
router.post('/routines/:username/:id/tuesday_delete/', exercisesController.tuesdaydelete)
router.post('/routines/:username/:id/wednesday_delete/', exercisesController.wednesdaydelete)
router.post('/routines/:username/:id/thursday_delete/', exercisesController.thursdaydelete)
router.post('/routines/:username/:id/friday_delete/', exercisesController.fridaydelete)
router.post('/routines/:username/:id/saturday_delete/', exercisesController.saturdaydelete)
router.post('/routines/:username/:id/sunday_delete/', exercisesController.sundaydelete)

//add exercises
router.post('/abs/hanginglegraise/', exercisesController.hanginglegraise)
router.post('/biceps/bicepcurls/', exercisesController.bicepcurls)
router.post('/calves/calfraises/', exercisesController.calfraises)
router.post('/chest/barbellbenchpress/', exercisesController.barbellbenchpress)
router.post('/chest/inclinebenchpress/', exercisesController.inclinebenchpress)
router.post('/frontdeltoids/overheadpress/', exercisesController.overheadpress)
router.post('/quadriceps/barbellsquat/', exercisesController.barbellsquat)
router.post('/trapezius/shrugs/', exercisesController.shrugs)

module.exports = router;
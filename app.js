const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose  = require('mongoose');
const app = express();
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const flash = require('connect-flash')
const PORT = process.env.PORT || 5000;

app.use("/public", express.static(path.resolve(__dirname + '/public'))); //make the folder public

require('./config/passport')(passport);

//DB config
const db = require('./config/keys').MongoURI;

mongoose.connect(db, { useNewUrlParser: true})
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.log(err));

app.use(expressLayouts);
app.set('view engine', 'ejs');

//bodyparser
app.use(express.urlencoded({ extended: false }));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

//connect flash
app.use(flash());

app.use((req, res, next)=> { //global variables middleware
	res.locals.success_msg = req.flash('success_msg')
	res.locals.error_msg = req.flash('error_msg')
	next();
})

app.use(passport.initialize());
app.use(passport.session());


//routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/muscles', require('./routes/muscles'))

app.listen(PORT, ()=>{
    console.log(`Server running at ${PORT}`)
});
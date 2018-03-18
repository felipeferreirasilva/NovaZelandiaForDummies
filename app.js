const express           = require('express'),
      bodyParser        = require('body-parser'),
      methodOverride    = require('method-override'),
      passport          = require('passport'),
      flash             = require('connect-flash'),
      localStrategy     = require('passport-local'),
      db                = require('./models'),
      routes            = require('./controllers/routes'),
      app               = express();


// FOLDER PUBLIC SETUP
app.use(express.static('public'));

// EJS SETUP
app.set('view engine', 'ejs');

// BODY PARSER SETUP
app.use(bodyParser.urlencoded({extended: true}));

// METHOD OVERRIDE SETUP
app.use(methodOverride('_method'));

// EXPRESS SESSION SETUP
app.use(require('express-session')({secret: 'nzfd', resave: false, saveUninitialized: false}));

// SETUP FLASH
app.use(flash());

// PASSPORT SETUP
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(db.User.authenticate()));
passport.serializeUser(db.User.serializeUser());
passport.deserializeUser(db.User.deserializeUser());

// SEND THESE VARIABLES TO ALL PAGES
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.isLogged = req.isAuthenticated();
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// IMPORT ROUTES
app.use(routes);

// SERVICE START
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Server listening on port %s', port);
});
const express           = require('express'),
      mongoose          = require('mongoose'),
      bodyParser        = require('body-parser'),
      methodOverride    = require('method-override'),
      passport          = require('passport'),
      LocalStrategy     = require('passport-local'),
      User              = require('./models/user'),
      Routes            = require('./routes'),
      app               = express();

// PROD DATABASE URL
mongoose.connect('mongodb://nzfd:nzfd6079@mongo_nzfd:27017/nzfd');

// TEST DATABASE URL //
// mongoose.connect('mongodb://localhost/nzfd');

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

// PASSPORT SETUP
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// IMPORT ROUTES
app.use(Routes);

// SERVICE START
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Server listening on port %s', port);
});
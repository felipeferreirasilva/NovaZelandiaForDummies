const express               = require('express'),
      mongoose              = require('mongoose'),
      bodyParser            = require('body-parser'),
      expressSanitizer      = require('express-sanitizer'),
      methodOverride        = require('method-override'),
      passport              = require('passport'),
      LocalStrategy         = require('passport-local'),
      User                  = require('./models/user'),
      Routes                = require('./routes');
      app                   = express();

mongoose.connect('mongodb://nzfd:nzfd6079@mongo_nzfd:27017/nzfd');
// mongoose.connect('mongodb://localhost/nzfd');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(require('express-session')({secret: 'nzfd', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

// ROUTES
app.use(Routes);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Server listening on port %s', port);
});

const express               = require('express'),
      mongoose              = require('mongoose'),
      bodyParser            = require('body-parser'),
      methodOverride        = require('method-override'),
      passport              = require('passport'),
      LocalStrategy         = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      Questions             = require('./models/questions'),
      User                  = require('./models/user'),
      app                   = express()

mongoose.connect('mongodb://nzfd:nzfd6079@mongo_nzfd:27017/nzfd');
// mongoose.connect('mongodb://localhost/nzfd');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(methodOverride('_method'));

app.use(require('express-session')({
    secret: 'nzfd',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', function(req, res){
    res.render('index', {logged: req.isAuthenticated(), user: req.user});
});

app.get('/about', function(req, res){
    res.render('about', {logged: req.isAuthenticated(), user: req.user});
});

app.get('/questions', function(req, res){
    var query = req.query.search;
    if(query){
        Questions.find({answer: { $regex: query, $options: 'i'}}, function(err, data){
            if(err){
                console.log(err);
            }else{
                res.render('questions', {questions: data, query: query, logged: req.isAuthenticated(), user: req.user});
            }
        });
    }else{
        Questions.find({}, function(err, data){
            if(err){
                console.log(err);
            }else{
                res.render('questions', {questions: data, query: query, logged: req.isAuthenticated(), user: req.user});
            }
        });
    }
});

app.post('/questions', function(req, res){
    var title = req.body.title;
    var answer = req.body.answer;
    var category = req.body.category;
    var question = {title: title, answer: answer, category: category, approved: false, author: req.user.name}
    Questions.create(question);
    res.redirect('/questions/new');
});

app.get('/questions/new', isLoggedIn, function(req, res){
    res.render('newquestion', {logged: req.isAuthenticated(), user: req.user});
})

app.put('/questions/:id', function(req, res){
    var id = req.body.id;
    var title = req.body.title;
    var answer = req.body.answer;
    var category = req.body.category;
    var approved = req.body.approved;
    var question = {title: title, answer: answer, category: category, approved: approved, author: req.user.name}
    
    Questions.findByIdAndUpdate(id, question, function(err, data){
        if(err){
            console.log(err);
        }else{
            res.redirect('/questions');
        }
    });
});

app.get('/questions/:id/edit', isLoggedIn, function(req, res){
    if(req.user.role === 'editor' || req.user.role === 'admin'){
        Questions.findById(req.params.id, function(err, data){
            if(err){
                console.log(err);
            }else{
                res.render('updatequestion', {question: data, logged: req.isAuthenticated(), user: req.user});
            }
        });
    }else{
        res.redirect('/');
    }
});

app.get('/unapprovedquestions', isLoggedIn, function(req, res){
    if(req.user.role === 'editor' || req.user.role === 'admin'){
        Questions.find({approved: false}, function(err, data){
            if(err){
                console.log(err);
            }else{
                res.render('unapprovedquestion', {questions: data, logged: req.isAuthenticated(), user: req.user});
            }
        });
    }
});

app.get('/register', function(req, res){
    res.render('register', {logged: req.isAuthenticated(), user: req.user});
});

app.post('/register', function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.email;
    var password = req.body.password;

    User.register({name: name, email: email, role: 'user', username: username}, password, function(err, user){
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
    });
});

app.get('/login', function(req, res){
    res.render('login', {logged: req.isAuthenticated(), user: req.user});
});

app.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login'
}), function(req, res){
    
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Server listening on port %s', port);
});
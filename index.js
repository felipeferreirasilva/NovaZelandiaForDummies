const express               = require('express'),
      app                   = express(),
      mongoose              = require('mongoose'),
      bodyParser            = require('body-parser'),
      request               = require('request'),
      methodOverride        = require('method-override'),
      passport              = require('passport'),
      LocalStrategy         = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      Questions             = require('./models/questions'),
      User                  = require('./models/user')

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
    res.render('index', {logged: req.isAuthenticated()});
});

app.get('/about', function(req, res){
    res.render('about', {logged: req.isAuthenticated()});
});

app.get('/questions', function(req, res){
    var query = req.query.search;
    if(query){
        Questions.find({answer: { $regex: query, $options: 'i'}}, function(err, data){
            if(err){
                console.log('Erro ao carregar perguntas ' + err);
            }else{
                res.render('questions', {questions: data, query: query, logged: req.isAuthenticated()});
            }
        });
    }else{
        Questions.find({}, function(err, data){
            if(err){
                console.log('Erro ao carregar perguntas ' + err);
            }else{
                res.render('questions', {questions: data, query: query, logged: req.isAuthenticated()});
            }
        });
    }
});

app.post('/questions', function(req, res){
    var title = req.body.title;
    var answer = req.body.answer;
    var category = req.body.category;
    var question = {title: title, answer: answer, category: category}
    Questions.create(question);
    res.redirect('/questions/new');
});

app.get('/questions/new', isLoggedIn, function(req, res){
    res.render('newquestion', {logged: req.isAuthenticated()});
})

app.put('/questions/:id', function(req, res){
    var id = req.body.id;
    var title = req.body.title;
    var answer = req.body.answer;
    var category = req.body.category;
    var question = {title: title, answer: answer, category: category}
    
    Questions.findByIdAndUpdate(id, question, function(err, data){
        if(err){
            console.log('Não foi possivel atualizar ' + err);
        }else{
            res.redirect('/questions');
        }
    });
});

app.get('/questions/:id/edit', isLoggedIn, function(req, res){
    var id = req.params.id;
    Questions.findById(id, function(err, data){
        if(err){
            console.log('Erro ao buscar pergunta ' + err);
        }else{
            res.render('updatequestion', {question: data, logged: req.isAuthenticated()});
        }
    });
});

app.get('/register', function(req, res){
    res.render('register', {logged: req.isAuthenticated()});
});

app.post('/register', function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.email;
    var password = req.body.password;

    User.register({name: name, email: email, role: 'user', username: username}, password, function(err, user){
        if(err){
            console.log('Erro ao cadastrar usuario: ' + err);
        }else{
            res.redirect('/');
        }
    });
});

app.get('/login', function(req, res){
    res.render('login', {logged: req.isAuthenticated()});
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
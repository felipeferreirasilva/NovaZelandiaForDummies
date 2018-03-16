const route                  = require('express').Router(),
      Questions              = require('./models/questions'),
      User                   = require('./models/user'),
      passport               = require('passport');

// INDEX
route.get('/', function(req, res){
    res.render('index', {logged: req.isAuthenticated(), user: req.user});
});

// ABOUT
route.get('/about', function(req, res){
    res.render('about', {logged: req.isAuthenticated(), user: req.user});
});

// LIST QUESTIONS
route.get('/questions', function(req, res){
    var query = req.query.search;
    if(query){
        Questions.find({answer: { $regex: query, $options: 'i'}, approved: true}, function(err, data){
            if(err){
                console.log(err);
            }else{
                res.render('questions', {questions: data, query: query, logged: req.isAuthenticated(), user: req.user});
            }
        });
    }else{
        Questions.find({ approved: true}, function(err, data){
            if(err){
                console.log(err);
            }else{
                res.render('questions', {questions: data, query: query, logged: req.isAuthenticated(), user: req.user});
            }
        });
    }
});

// CREATE QUESTION
route.post('/questions', isLoggedIn, function(req, res){
    var title = req.body.title;
    var answer = req.body.answer;
    var category = req.body.category;
    var question = {title: title, answer: answer, category: category, approved: false, author: req.user.name}
    Questions.create(question);
    res.redirect('/questions/new');
});

// CREATE QUESTION FORM
route.get('/questions/new', isLoggedIn, function(req, res){
    res.render('newquestion', {logged: req.isAuthenticated(), user: req.user});
});

// LIST NONAPPROVED QUESTIONS
route.get('/questions/toapprove', isLoggedIn, function(req, res){
    if(req.user.role === 'editor' || req.user.role === 'admin'){
        Questions.find({approved: false}, function(err, data){
            if(err){
                console.log(err);
            }else{
                res.render('toapprovequestions', {questions: data, logged: req.isAuthenticated(), user: req.user});
            }
        });
    }else{
        res.redirect('/');
    }
});

// UPDATE QUESTION
route.put('/questions/:id', isLoggedIn, function(req, res){
    var id = req.body.id;
    var title = req.body.title;
    var answer = req.body.answer;
    var category = req.body.category;
    var question = {title: title, answer: answer, category: category, author: req.user.username}
    
    Questions.findByIdAndUpdate(id, question, function(err, data){
        if(err){
            console.log(err);
        }else{
            res.redirect('/questions');
        }
    });
});

// UPDATE QUESTION FORM
route.get('/questions/:id/edit', isLoggedIn, function(req, res){
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

// DELETE QUESTION
route.delete('/questions/:id', isLoggedIn, function(req, res){
    if(req.user.role === 'admin'){
        Questions.findByIdAndRemove(req.params.id, function(err, data){
            if(err){
                console.log(err);
            }else{
                res.redirect('/questions/toapprove');
            }
        });
    }else{
        res.redirect('/');
    }
});

// APPROVE QUESTION
route.get('/questions/:id/approve', isLoggedIn, function(req, res){
    if(req.user.role === 'editor' || req.user.role === 'admin'){
        Questions.findByIdAndUpdate(req.params.id, {approved: true}, function(err, data){
            if(err){
                console.log(err);
            }else{
                res.redirect('/questions/toapprove');
            }
        });
    }else{
        res.redirect('/');
    }
});

// DISAPPROVE QUESTION
route.get('/questions/:id/disapprove', isLoggedIn, function(req, res){
    if(req.user.role === 'editor' || req.user.role === 'admin'){
        Questions.findByIdAndUpdate(req.params.id, {approved: false}, function(err, data){
            if(err){
                console.log(err);
            }else{
                res.redirect('/questions');
            }
        });
    }else{
        res.redirect('/');
    }
});

// REGISTER FORM
route.get('/register', function(req, res){
    res.render('register', {logged: req.isAuthenticated(), user: req.user});
});

// REGISTER 
route.post('/register', function(req, res){
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

// LOGIN FORM
route.get('/login', function(req, res){
    res.render('login', {logged: req.isAuthenticated(), user: req.user});
});

// LOGIN
route.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login'
}), function(req, res){});

// LOGOUT
route.get('/logout', isLoggedIn, function(req, res){
    req.logout();
    res.redirect('/');
});

// USER FORM
route.get('/user', isLoggedIn, function(req, res){
    if(req.user.role === 'admin'){
        var username = req.query.search;
        if(username){
            User.findOne({username: username}, function(err, data){
                if(err){
                    console.log(err);
                }else{
                    res.render('user', {logged: req.isAuthenticated(), data: data, user: req.user});
                }
            });
        }else{
            res.render('user', {logged: req.isAuthenticated(), data: false, user: req.user});
        }
    }else{
        res.redirect('/')
    }
});

// USER UPDATE
route.put('/user', function(req, res){
    if(req.user.role === 'admin'){
        var id = req.body.id;
        var name = req.body.name;
        var email = req.body.email;
        var role = req.body.role;
        var user = {name: name, username: email, email: email, role:role};

        User.findByIdAndUpdate(id, user, function(err, data){
            if(err){
                console.log(err);
            }else{
                res.redirect('/user');
            }
        });
    }else{
        res.redirect('/')
    }
});

// MIDDLEWARE TO VERIFY IF USER IS LOGGED
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

module.exports = route;
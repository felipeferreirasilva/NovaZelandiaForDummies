const route                  = require('express').Router(),
      Questions              = require('./models/questions'),
      User                   = require('./models/user'),
      passport               = require('passport');


route.get('/', function(req, res){
    res.render('index', {logged: req.isAuthenticated(), user: req.user});
});

route.get('/about', function(req, res){
    res.render('about', {logged: req.isAuthenticated(), user: req.user});
});

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

route.post('/questions', isLoggedIn, function(req, res){
    var title = req.body.title;
    var answer = req.sanitize(req.body.answer);
    var category = req.body.category;
    var question = {title: title, answer: answer, category: category, approved: false, author: req.user.name}
    Questions.create(question);
    res.redirect('/questions/new');
});

route.get('/questions/new', isLoggedIn, function(req, res){
    res.render('newquestion', {logged: req.isAuthenticated(), user: req.user});
});

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

route.put('/questions/:id', isLoggedIn, function(req, res){
    var id = req.body.id;
    var title = req.body.title;
    var answer = req.sanitize(req.body.answer);
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

route.get('/register', function(req, res){
    res.render('register', {logged: req.isAuthenticated(), user: req.user});
});

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

route.get('/login', function(req, res){
    res.render('login', {logged: req.isAuthenticated(), user: req.user});
});

route.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login'
}), function(req, res){});

route.get('/logout', isLoggedIn, function(req, res){
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

module.exports = route;
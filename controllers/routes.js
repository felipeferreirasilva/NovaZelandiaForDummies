const route         = require('express').Router(),
      middleware    = require('../middleware'),
      passport      = require('passport'),
      db            = require('../models'),
      strings       = require('../public/consts');

// INDEX
route.get('/', function(req, res){
    res.render('index');
});

// ABOUT
route.get('/about', function(req, res){
    res.render('about');
});

// LIST QUESTIONS
route.get('/questions', function(req, res){
    var query = req.query.search;
    if(query){
        db.Questions.find({answer: { $regex: query, $options: 'i'}, approved: true})     
        .then(function(data){
            if(data.length == 0){
                res.render('questions', {questions: data, query: query, error: strings.noQuestionsFound});
            }else{
                res.render('questions', {questions: data, query: query});
            }
        })       
        .catch(function(err){
            console.log(err);
        });
    }else{
        db.Questions.find({ approved: true})
        .then(function(data){
            res.render('questions', {questions: data, query: query});
        })
        .catch(function(err){
            console.log(err);
        });        
    }
});

// CREATE QUESTION
route.post('/questions', function(req, res){
    var title = req.body.title;
    var answer = req.body.answer;
    var category = req.body.category;
    var author = " ";
    if(req.isAuthenticated()){author = req.user.username};
    var question = {title: title, answer: answer, category: category, approved: false, author: author}
    db.Questions.create(question)
    .then(function(){
        req.flash('success', strings.questionCreateSuccessful);
        res.redirect('/questions/new');
    })
    .catch(function(err){
        console.log(err);
    });
});

// CREATE QUESTION FORM
route.get('/questions/new', function(req, res){
    res.render('newquestion');
});

// LIST NONAPPROVED QUESTIONS
route.get('/questions/toapprove', middleware.isLoggedIn, function(req, res){
    if(req.user.role === 'editor' || req.user.role === 'admin'){
        db.Questions.find({approved: false})
        .then(function(data){
            res.render('toapprovequestions', {questions: data});
        })
        .catch(function(err){
            console.log(err);
        }); 
    }else{
        req.flash('error', strings.noPermission);
        res.redirect('/');
    }
});

// UPDATE QUESTION
route.put('/questions/:id', middleware.isLoggedIn, function(req, res){
    var id = req.body.id;
    var title = req.body.title;
    var answer = req.body.answer;
    var category = req.body.category;
    var question = {title: title, answer: answer, category: category, author: req.user.username}; 
    db.Questions.findByIdAndUpdate(id, question)
    .then(function(){
        req.flash('success', strings.questionUpdated);
        res.redirect('/questions');
    })
    .catch(function(err){
        console.log(err);
    });
});

// UPDATE QUESTION FORM
route.get('/questions/:id/edit', middleware.isLoggedIn, function(req, res){
    if(req.user.role === 'editor' || req.user.role === 'admin'){
        db.Questions.findById(req.params.id)
        .then(function(data){
            res.render('updatequestion', {question: data});
        })
        .catch(function(err){
            console.log(err);
        });
    }else{
        req.flash('error', strings.noPermission);
        res.redirect('/');
    }
});

// DELETE QUESTION
route.delete('/questions/:id', middleware.isLoggedIn, function(req, res){
    if(req.user.role === 'admin'){
        db.Questions.findByIdAndRemove(req.params.id)
        .then(function(){
            req.flash('success', strings.questionDeleted);
            res.redirect('/questions/toapprove');
        })
        .catch(function(err){
            console.log(err);
        });    
    }else{
        req.flash('error', strings.noPermission);
        res.redirect('/');
    }
});

// APPROVE QUESTION
route.put('/questions/:id/approve', middleware.isLoggedIn, function(req, res){ 
    if(req.user.role === 'editor' || req.user.role === 'admin'){
        db.Questions.findByIdAndUpdate(req.params.id, {approved: true})
        .then(function(){
            req.flash('success', strings.questionApproved);
            res.redirect('/questions/toapprove');
        })
        .catch(function(err){
            console.log(err);
        });
    }else{
        req.flash('error', strings.noPermission);
        res.redirect('/');
    }
});

// DISAPPROVE QUESTION
route.put('/questions/:id/disapprove', middleware.isLoggedIn, function(req, res){  
    if(req.user.role === 'editor' || req.user.role === 'admin'){
        db.Questions.findByIdAndUpdate(req.params.id, {approved: false})
        .then(function(){
            req.flash('success', strings.questionRepproved);
            res.redirect('/questions');
        })
        .catch(function(err){
            console.log(err);
        });
    }else{
        req.flash('error', strings.noPermission);
        res.redirect('/');
    }
});

// REGISTER FORM
route.get('/register', function(req, res){
    res.render('register');
});

// REGISTER 
route.post('/register', function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.email;
    var password = req.body.password;
    db.User.register({name: name, email: email, role: 'user', username: username}, password)
    .then(function(){
        req.flash('success', strings.signupFinished);
        res.redirect('/');
    })
    .catch(function(err){
        req.flash('error' , err.message);
        res.redirect('/register');
    });
});

// LOGIN FORM
route.get('/login', function(req, res){
    res.render('login');
});

// LOGIN
route.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash : true
}), function(req, res){});

// LOGOUT
route.get('/logout', middleware.isLoggedIn, function(req, res){
    req.logout();
    req.flash('success', strings.loggedOut);
    res.redirect('/');
});

// USER FORM
route.get('/user', middleware.isLoggedIn, function(req, res){
    if(req.user.role === 'admin'){
        var username = req.query.search;
        if(username){
            db.User.findOne({username: username})
            .then(function(data){
                res.render('user', {data: data});
            })
            .catch(function(err){
                console.log(err);
            });
        }else{
            res.render('user', {data: false});
        }
    }else{
        req.flash('error', strings.noPermission);
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
        db.User.findByIdAndUpdate(id, user)
        .then(function(){
            req.flash('success', strings.userUpdated);
            res.redirect('/user');
        })
        .catch(function(err){
            req.flash('error' , err.message);
            res.redirect('/');
        });
    }else{
        req.flash('error', strings.noPermission);
        res.redirect('/')
    }
});

module.exports = route;
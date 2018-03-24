const   db              = require('../models'),
        strings         = require('../helpers/'),
        request         = require('request');

exports.getQuestion = function(req, res){
    db.Question.findById(req.params.id)
    .then(function(question){
        db.Comment.find({questionId: req.params.id})     
        .then(function(comments){
            res.render('question', {question: question, comments: comments})
        })
        .catch(function(err){
            console.log(err)
            res.redirect('/')
        }) 
    })
    .catch(function(err){
        console.log(err);
        res.redirect('/')
    })
}

exports.getQuestions = function(req, res){
    var query = req.query.search;
    if(query){
        db.Question.find({answer: { $regex: query, $options: 'i'}, approved: true})     
        .then(function(data){
            if(data.length == 0){
                res.render('questions', {questions: data, query: query, error: strings.const.text.noQuestionsFound});
            }else{
                db.Comment.find({})     
                .then(function(comments){
                    res.render('questions', {questions: data, query: query, comments: comments});
                })
            }
        })       
        .catch((err) => console.log(err));
    }else{
        db.Question.find({ approved: true})
        .then(function(data){
            db.Comment.find({})     
            .then(function(comments){
                res.render('questions', {questions: data, query: query, comments: comments});
            })
        })
        .catch((err) => console.log(err));        
    }
}

exports.createQuestion = function(req, res){
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        req.flash('error', strings.const.text.captchaError);
        res.redirect('/questions/new');
    }else{
        var secretKey = "6LenkE4UAAAAADFgHmVE66OjbLah8AqoGRR3_nxC";
        var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
        request(verificationUrl,function(error,response,body) {
            body = JSON.parse(body);   
            if(body.success === true){
                var title = req.body.title;
                var answer = req.body.answer;
                var category = req.body.category;
                var author = " ";
                if(req.isAuthenticated()){author = req.user.username};
                var question = {title: title, answer: answer, category: category, approved: false, author: author}
                db.Question.create(question)
                .then(function(){
                    req.flash('success', strings.const.text.questionCreateSuccessful);
                    res.redirect('/questions/new');
                })
                .catch((err) => console.log(err));
            }
        });
    }
}

exports.getNonapprovedQuestions = function(req, res){
    if(req.user.role === 'editor' || req.user.role === 'admin'){
        db.Question.find({approved: false})
        .then(function(data){
            res.render('toapprovequestions', {questions: data});
        })
        .catch((err) => console.log(err)); 
    }else{
        req.flash('error', strings.const.text.noPermission);
        res.redirect('/');
    }
}

exports.updateQuestion = function(req, res){
    var id = req.body.id;
    var title = req.body.title;
    var answer = req.body.answer;
    var category = req.body.category;
    var question = {title: title, answer: answer, category: category, author: req.user.username}; 
    db.Question.findByIdAndUpdate(id, question)
    .then(function(){
        req.flash('success', strings.const.text.questionUpdated);
        res.redirect('/questions');
    })
    .catch((err) => console.log(err));
}

exports.deleteQuestion = function(req, res){
    if(req.user.role === 'admin'){
        db.Question.findByIdAndRemove(req.params.id)
        .then(function(){
            db.Comment.remove({questionId: req.params.id})
            .then(function(){
                req.flash('success', strings.const.text.questionDeleted);
                res.redirect('/questions/toapprove');
            })
            .catch((err) => console.log(err));        
        })
        .catch((err) => console.log(err));    
    }else{
        req.flash('error', strings.const.text.noPermission);
        res.redirect('/');
    }
}

exports.updateQuestionForm = function(req, res){
    if(req.user.role === 'editor' || req.user.role === 'admin'){
        db.Question.findById(req.params.id)
        .then(function(data){
            res.render('updatequestion', {question: data});
        })
        .catch((err) => console.log(err));
    }else{
        req.flash('error', strings.const.text.noPermission);
        res.redirect('/');
    }
}

exports.approveQuestion = function(req, res){ 
    if(req.user.role === 'editor' || req.user.role === 'admin'){
        db.Question.findByIdAndUpdate(req.params.id, {approved: true})
        .then(function(){
            req.flash('success', strings.const.text.questionApproved);
            res.redirect('/questions/toapprove');
        })
        .catch((err) => console.log(err));
    }else{
        req.flash('error', strings.const.text.noPermission);
        res.redirect('/');
    }
}

exports.disapproveQuestion = function(req, res){  
    if(req.user.role === 'editor' || req.user.role === 'admin'){
        db.Question.findByIdAndUpdate(req.params.id, {approved: false})
        .then(function(){
            req.flash('success', strings.const.text.questionRepproved);
            res.redirect('/questions');
        })
        .catch((err) => console.log(err));
    }else{
        req.flash('error', strings.const.text.noPermission);
        res.redirect('/');
    }
}

module.exports = exports;
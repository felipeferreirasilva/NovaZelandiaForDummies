const   db              = require('../models'),
        strings         = require('../helpers/')

exports.createComment = function(req, res){
    db.Comment.create({questionId: req.params.id, text: req.body.text, author: req.user.name, username: req.user.username})
    .then(function(){
        req.flash('success', strings.const.text.commentCreated)
        res.redirect('/questions/' + req.params.id + '/comment')
    })
    .catch(function(err){
        console.log(err)
    })
}

exports.getComment = function(req, res){
    db.Question.findById(req.params.id)
    .then(function(question){
        db.Comment.find({questionId: req.params.id})     
        .then(function(comments){
            res.render('comments', {question: question, comments: comments})
        })
        .catch(function(err){
            console.log(err)
        }) 
    })
    .catch(function(err){
        console.log(err);
    })
}
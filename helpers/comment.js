const   db              = require('../models'),
        strings         = require('../helpers/')

exports.createComment = function(req, res){
    db.Comment.create({questionId: req.params.id, text: req.body.text, author: req.user.name, username: req.user.username})
    .then(function(){
        req.flash('success', strings.const.text.commentCreated)
        res.redirect('/questions/' + req.params.id + '/comment')
    })
    .catch((err) => console.log(err))
}

exports.getComment = function(req, res){
    db.Question.findById(req.params.id)
    .then(function(question){
        db.Comment.find({questionId: req.params.id})     
        .then(function(comments){
            res.render('comments', {question: question, comments: comments})
        })
        .catch((err) => console.log(err)) 
    })
    .catch((err) => console.log(err))
}

exports.deleteComment = function(req, res){        
    if(req.user.role === 'admin'){
        db.Comment.findByIdAndRemove(req.query.cid)
        .then(function(){
            req.flash('success', strings.const.text.commentDeleted)
            res.redirect('/questions/' + req.params.id + '/comment')
        })
        .catch((err) => console.log(err))
    }else{
        res.redirect('/')
    }
}

module.exports = exports;
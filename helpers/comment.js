const   db              = require('../models'),
        strings         = require('../helpers/')

exports.createComment = function(req, res){
    db.Comment.create({questionId: req.query.id, text: req.body.text, author: req.user.name, username: req.user.username})
    .then(function(){
        res.redirect('/questions/' + req.query.id)
    })
    .catch(function(err){
        console.log(err)
    })
}
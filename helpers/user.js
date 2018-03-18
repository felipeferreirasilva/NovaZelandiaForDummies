const   db              = require('../models'),
        strings         = require('../helpers/')

exports.createUser = function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.email;
    var password = req.body.password;
    db.User.register({name: name, email: email, role: 'user', username: username}, password)
    .then(function(){
        req.flash('success', strings.const.text.signupFinished);
        res.redirect('/');
    })
    .catch(function(err){
        req.flash('error' , err.message);
        res.redirect('/register');
    });
}

exports.logout = function(req, res){
    req.logout();
    req.flash('success', strings.const.text.loggedOut);
    res.redirect('/');
}

exports.editUserForm = function(req, res){
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
        req.flash('error', strings.const.text.noPermission);
        res.redirect('/')
    }
}

exports.editUser = function(req, res){
    if(req.user.role === 'admin'){
        var id = req.body.id;
        var name = req.body.name;
        var email = req.body.email;
        var role = req.body.role;
        var user = {name: name, username: email, email: email, role:role};
        db.User.findByIdAndUpdate(id, user)
        .then(function(){
            req.flash('success', strings.const.text.userUpdated);
            res.redirect('/user');
        })
        .catch(function(err){
            req.flash('error' , err.message);
            res.redirect('/');
        });
    }else{
        req.flash('error', strings.const.text.noPermission);
        res.redirect('/')
    }
}

module.exports = exports;
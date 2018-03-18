const middlware = {
    // MIDDLEWARE TO VERIFY IF USER IS LOGGED
    isLoggedIn : function (req, res, next){
        if(req.isAuthenticated()){
        return next();
    }
        req.flash('error', 'Você não esta logado!');
        res.redirect('/login');
    }
};

module.exports = middlware;
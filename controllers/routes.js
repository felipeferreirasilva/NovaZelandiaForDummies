const   router      = require('express').Router(),
        middleware  = require('../middleware'),
        passport    = require('passport'),
        helpers     = require('../helpers');

// INDEX
router.route('/')
.get(function(req, res){
    res.render('index');
});

// ABOUT
router.route('/about')
.get(function(req, res){
    res.render('about');
});

// LIST AND CREATE QUESTIONS
router.route('/questions')
.get(helpers.question.getQuestions)
.post(helpers.question.createQuestion);

// CREATE QUESTION FORM
router.get('/questions/new', function(req, res){
    res.render('newquestion');
});

// LIST NONAPPROVED QUESTIONS
router.route('/questions/toapprove') 
.get(middleware.auth.isLoggedIn, helpers.question.getNonapprovedQuestions);

// UPDATE QUESTION
router.route('/questions/:id')
.put(middleware.auth.isLoggedIn, helpers.question.updateQuestion)
.delete(middleware.auth.isLoggedIn, helpers.question.deleteQuestion);

// UPDATE QUESTION FORM
router.route('/questions/:id/edit')
.get(middleware.auth.isLoggedIn, helpers.question.updateQuestionForm);

// APPROVE QUESTION
router.route('/questions/:id/approve')
.put(middleware.auth.isLoggedIn, helpers.question.approveQuestion)

// DISAPPROVE QUESTION
router.route('/questions/:id/disapprove')
.put(middleware.auth.isLoggedIn, helpers.question.disapproveQuestion);

// REGISTER 
router.route('/register')
.get(function(req, res){
    res.render('register');
})
.post(helpers.user.createUser);

// LOGIN
router.route('/login')
.get(function(req, res){
    res.render('login');
})
.post(passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash : true
}));

// LOGOUT
router.route('/logout')
.get(middleware.auth.isLoggedIn, helpers.user.logout);

// EDIT USER
router.route('/user')
.get(middleware.auth.isLoggedIn, helpers.user.editUserForm)
.put(helpers.user.editUser);

module.exports = router;
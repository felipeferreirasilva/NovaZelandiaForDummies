const   router      = require('express').Router(),
        middleware  = require('../middleware'),
        passport    = require('passport'),
        helpers     = require('../helpers');

// INDEX
router.route('/')
.get((req, res) => res.render('index'));

// ABOUT
router.route('/about')
.get((req, res) => res.render('about'));

// LIST AND CREATE QUESTIONS
router.route('/questions')
.get(helpers.question.getQuestions)
.post(helpers.question.createQuestion);

// CREATE QUESTION FORM
router.route('/questions/new') 
.get((req, res) => res.render('newquestion'));

// LIST NONAPPROVED QUESTIONS
router.route('/questions/toapprove') 
.get(middleware.auth.isLoggedIn, helpers.question.getNonapprovedQuestions);

// QUESTION
router.route('/questions/:id')
.get(helpers.question.getQuestion)
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

// COMMENTS
router.route('/questions/:id/comment')
.get(helpers.comment.getComment)
.post(middleware.auth.isLoggedIn, helpers.comment.createComment)
.delete(middleware.auth.isLoggedIn, helpers.comment.deleteComment)

// REGISTER 
router.route('/register')
.get((req, res) => res.render('register'))
.post(helpers.user.createUser);

// LOGIN
router.route('/login')
.get((req, res) => res.render('login'))
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

// EXPORT ROUTES TO APP.JS
module.exports = router;
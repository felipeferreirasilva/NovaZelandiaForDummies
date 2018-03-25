const   router      = require('express').Router(),
        middleware  = require('../middleware'),
        passport    = require('passport'),
        helpers     = require('../helpers');

// HOME
router.route('/')
// SHOW HOME PAGE
.get((req, res) => res.render('index'));

// ABOUT
router.route('/about')
// SHOW ABOUT PAGE
.get((req, res) => res.render('about'));

// QUESTIONS
router.route('/questions')
// SHOW QUESTIONS PAGE
.get(helpers.question.getQuestions)
// CREATE QUESTION
.post(helpers.question.createQuestion);

// SHOW CREATE QUESTION FORM
router.route('/questions/new') 
.get((req, res) => res.render('newquestion'));

// NONAPPROVED QUESTIONS
router.route('/questions/toapprove') 
// SHOW NONAPPROVED QUESTIONS
.get(middleware.auth.isLoggedIn, helpers.question.getNonapprovedQuestions);

// QUESTION
router.route('/questions/:id')
// SHOW ONE QUESTION
.get(helpers.question.getQuestion)
// UPDATE ONE QUESTION
.put(middleware.auth.isLoggedIn, helpers.question.updateQuestion)
// DELETE ONE QUESTION
.delete(middleware.auth.isLoggedIn, helpers.question.deleteQuestion);

// SHOW UPDATE QUESTION FORM
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
// SHOW COMMENTS OF ONE QUESTION
.get(helpers.comment.getComment)
// CREATE COMMENT
.post(middleware.auth.isLoggedIn, helpers.comment.createComment)
// DELETE COMMENT
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
const mongoose = require('mongoose');

const Question = mongoose.model('Question', {
    title: String,
    answer: String,
    category: String,
    approved: Boolean,
    author: String
});

module.exports = Question;
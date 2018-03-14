const mongoose = require('mongoose');

const Questions = mongoose.model('Question', {
    title: String,
    answer: String,
    category: String,
    approved: Boolean,
    author: String
});

module.exports = Questions;
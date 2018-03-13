const mongoose = require('mongoose');

const Questions = mongoose.model('Question', {
    title: String,
    answer: String,
    category: String,
    approved: Boolean
});

module.exports = Questions;
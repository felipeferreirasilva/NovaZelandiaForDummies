const mongoose = require('mongoose');

const Comment = mongoose.model('Comment', {
    questionId: String,
    text: String,
    author: String,
    username: String,
    date: {type: Date, default: Date.now}
})

module.exports = Comment;
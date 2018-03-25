const mongoose = require('mongoose');

// TEST DATABASE URL
mongoose.connect('mongodb://localhost/nzfd');

module.exports.Question = require('./question');
module.exports.User = require('./user');
module.exports.Comment = require('./comment')
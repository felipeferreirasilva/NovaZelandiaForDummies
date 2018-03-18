const mongoose = require('mongoose');

// PROD DATABASE URL
mongoose.connect('mongodb://nzfd:nzfd6079@mongo_nzfd:27017/nzfd');

// TEST DATABASE URL
// mongoose.connect('mongodb://localhost/nzfd');

module.exports.Questions = require('./questions');
module.exports.User = require('./user');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserShema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    username: String,
    password: String
});

UserShema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserShema);

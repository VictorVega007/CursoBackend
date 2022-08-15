'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = mongoose.model('User', Schema({
    username: String,
    password: String,
    email: String,
}));

module.exports = User;
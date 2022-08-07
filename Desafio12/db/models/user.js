'use strict';

const mongoose = require('mongoose');
// const { Schema } = mongoose;

const User = mongoose.model('User', mongoose.Schema({
    userName: String,
    password: String,
    email: String,
}));

module.exports = User;
'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
});

module.exports = userSchema;
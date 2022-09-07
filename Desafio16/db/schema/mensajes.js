'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const messagesSchema = new Schema({
    author: { type: Object, required: true },
    text: { type: String, required: true },
});

module.exports = messagesSchema;
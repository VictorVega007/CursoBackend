'use strict';

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    productos: { type: Object, required: true },
    timestamp: { type: Number, required: true },
    user: { type: String, required: true },
    status: { type: String, required: true }, 
});

module.exports = cartSchema;
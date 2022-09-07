'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const productsSchema = new Schema({
    title: { type: String, required: true },  
    thumbnail: { type: String, required: true },
    price: { type: Number, required: true },
});

module.exports = productsSchema;
'use strict';

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    codigo: { type: String, required: true },
    image: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
    timestamp: { type: Date, required: true }
});

module.exports = productSchema;

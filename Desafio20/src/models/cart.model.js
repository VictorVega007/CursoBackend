'use strict';

import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'productos'
        }
    ]
});

export const CartsModel = mongoose.model('carritos', Schema);
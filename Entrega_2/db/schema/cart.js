'use strict';

import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    productos: { type: Object, required: true },
    timestamp: { type: Number, required: true }
});

export default cartSchema;
'use strict';

const mongoose = require('mongoose');
const { dbLogger } = require('../utils/log4jsConfig');
let isConnected = false;

// const uri = 'mongodb+srv://victor:victor123@cluster0.5tx05.mongodb.net/ecommerce?retryWrites=true&w=majority';

const checkConnection = async (uri) => {
    if (!isConnected) {
        try {
            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            dbLogger.info('Connected to MongoDB');
            isConnected = true;
        } catch (error) {
            throw new Error(`Error connecting to MongoDB: ${error.message}`);
        };
    };
};

module.exports = { checkConnection };
'use strict';

const mongoose = require('mongoose');

class User {
    constructor(collectionName, schema, uri) {
        this.collectionName = mongoose.model(collectionName, schema);
        this.uri = uri;
        this.mongoConnect();
    };

    async mongoConnect() {
        try {
            await mongoose.connect(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('[USER] MongoDB connected');
        } catch (error) {
            throw new Error(`Error connecting to MongoDB ${console.log(error)}`);
        };
    };
};

module.exports = User;
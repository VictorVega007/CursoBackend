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
                useUnifiedTopology: true,
            });
            console.log(`[USER] Connected to MongoDB`);
        } catch (error) {
            throw Error(`Error connecting to mongoDB: ${error.message}`);
        };
    };
};

module.exports = User;
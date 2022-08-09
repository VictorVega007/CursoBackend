'use strict';

const mongoose = require('mongoose');

class containerMongoDb {
    constructor(collectionName, schema, uri) {
        this.collection = mongoose.model(collectionName, schema);
        this.uri = uri;
        this.mongoConnect();
    };

    async mongoConnect() {
        try {
            await mongoose.connect(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            console.log('Connected to MongoDB');
        } catch (error) {
            throw new Error(`Error connecting to MongoDB: ${console.log(error)}`);
        };
    };

    async save(newObject) {
        try {
            newObject.timestamp = Date.now();
            const createCollection = await this.collection.create(newObject);
            return createCollection;
        } catch (error) {
            throw new Error(`Error saving collection to MongoDB: ${console.log(error)}`);
        };
    };

    async getAll() {
        try {
            const getAllCollection = await this.collection.find();
            return getAllCollection;
        } catch (error) {
            throw new Error(`Error getting all collections: ${console.log(error)}`);
        };
    };
};

module.exports = containerMongoDb;
'use strict';

const containerMongoDb = require('../containers/containerMongoDB');

class MessagesDAOMongoDB extends containerMongoDb {
    constructor(collectionName, schema, uri) {
        super(collectionName, schema, uri);
    };
};

module.exports = MessagesDAOMongoDB;
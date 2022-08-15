'use strict';

const containerMongoDb = require('../containers/containerMongoDB');

class ProductsDAOMongoDB extends containerMongoDb {
    constructor(collectionName, schema, uri) {
        super(collectionName, schema, uri);
    };
};

module.exports = ProductsDAOMongoDB;
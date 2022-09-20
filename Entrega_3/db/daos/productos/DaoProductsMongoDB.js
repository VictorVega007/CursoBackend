'use strict';

const mongoDbContainer = require('../../containers/mongoDbContainer');
const mongoose = require('mongoose');
let productosDAOMongoDBInstance = null;

class ProductsMongoDB extends mongoDbContainer {
    constructor(collectionName, schema, uri) {
        super(collectionName, schema, uri);
    };

    static getInstance(collectionName, schema, uri) {
        if (!productosDAOMongoDBInstance) {
            productosDAOMongoDBInstance = new ProductsMongoDB(collectionName, schema, uri);
        };
        return productosDAOMongoDBInstance;
    };

    async updateById(id, newData) {
        try {
            await this.collection.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, newData);
            return {
                message: `The object with id '${id}' was successfully updated.`
            };
        } catch (error) {
            throw new Error('The id product does not exist.', error);
        };
    };
};

module.exports = ProductsMongoDB;
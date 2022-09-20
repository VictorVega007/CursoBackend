'use strict';

const mongoDbContainer = require('../../containers/mongoDbContainer');
const mongoose = require('mongoose');
// const { dbLogger } = require('../../../utils/log4jsConfig');
const { normalizeCartData } = require('../../DTOs/cartDTO');
let carritosDAOMongoDBInstance = null;

class DaoCartMongoDB extends mongoDbContainer {
    constructor(collectionName, schema, uri) {
        super(collectionName, schema, uri);
    };

    static getInstance (collectionName, schema, uri) {
        if (!carritosDAOMongoDBInstance) {
            carritosDAOMongoDBInstance = new DaoCartMongoDB(collectionName, schema, uri);
        };

        return carritosDAOMongoDBInstance;
    };

    async getCartByUserId(id) {
        try {
            const items = await this.collection.find({user: id});

            if (items) {
                return normalizeCartData(items);
            };
            throw new Error(`The id "${id}" is not found in the collection.`);
            
        } catch (error) {
            throw new Error(`Error reading getById function. ${error.message}`);
        };
    };

    async updateById(id, newData) {
        try {
            await this.collection.updateOne({_id: mongoose.Types.ObjectId(id)}, {
                $push: {productos: newData}
            });
            return { message: `The object with id ${id} has been updated successfully` };
        } catch (error) {
            throw new Error(`The object with id ${id} does not exist`);
        };
    };
};

module.exports = DaoCartMongoDB;
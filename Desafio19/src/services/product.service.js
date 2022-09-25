'use strict';

import '../config/db.config.js';
import { ProductsModel } from '../models/products.model.js';
import logger from '../utils/loggers/Log4jsLogger.js';

export class ProductService {
    ID_FIELD = '_id';
    
    static async exists(id) {
        try {
            return await ProductsModel.findById(id);
        } catch (error) {
            logger.error(error);
            return new Error(`Product ${id} does not exist. Error: ${error.message}`);
        };
    };

    async getAll() {
        try {
            return await ProductsModel.find();
        } catch (error) {
            logger.error(error);
            return new Error(`Couldn't find all products in. Error: ${error.message}`);
        };
    };
    
    async getProductById(objectId) {
        try {
            const product = await ProductsModel.findOne({
                [this.ID_FIELD] : objectId
            })
            return product;
        } catch (error) {
            logger.error(error);
            return new Error(`The product with ID ${this.ID_FIELD} was not found. Error: ${error.message}`);
        };
    };
    
    async createProduct(object) {
        try {
            return await ProductsModel.create(object);
        } catch (error) {
            logger.error(error);
            return new Error(`Couldn't create product. Error: ${error.message}`);
        };
    };
    
    async updateProductById(id, object) {
        try {
            await ProductsModel.findByIdAndUpdate(
                {
                    [this.ID_FIELD] : id
                },
                object, 
                {
                    runValidators: true
                })
            return true;
        } catch (error) {
            logger.error(error);
            return new Error(`The product with id ${id} could not be modified. Error: ${error.message}`);
        };
    };
    
    async deleteProductById(id) {
        try {
            return await ProductsModel.findByIdAndDelete({[this.ID_FIELD]: id});
        } catch (error) {
            logger.error(error);
            return new Error(`The prouct with ID ${id} was not found. Error: ${error.message}`);
        };
    };
};
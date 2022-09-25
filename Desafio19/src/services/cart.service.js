import "../config/db.config.js";
import { CartsModel } from '../models/cart.model.js';
import logger from '../utils/loggers/Log4jsLogger.js';

export class CartService {
    ID_FIELD = '_id';
    
    async createCart() {
        try {
            return await CartsModel.create({});
        } catch (error) {
            logger.error(error);
            return new Error(`There was an error creating cart ${error.message}`);
        };
    };
    
    async deleteCartById(id) {
        try {
            return await CartsModel.findByIdAndDelete({[this.ID_FIELD]: id});
        } catch (error) {
            logger.error(error);
            return new Error(`There was an error deleting cart with ID ${this.ID_FIELD}. Error: ${error.message}`);
        };
    };
    
    async saveProductToCart(id, obj) {
        try {
            const cart = await CartsModel.findById(id);
            cart.products.push(obj.productId);
            cart.save();
            return true;
        } catch (error) {
            logger.error(error);
            return new Error(`The product ${obj.productId} was not found. Error: ${error.message}`);
        };
    };
    
    async deleteProductFromCart(id, productId) {
        try {
            const cart = await CartsModel.findById(id);
            cart.products.remove(productId);
            cart.save();
            return true;
        } catch (error) {
            logger.error(error);
            return new Error(`Product with id ${productId} does not exist. Error: ${error.message}`);
        };
    };
    
    async getAllProductsFromCart(id) {
        try {
            return await CartsModel.findById(id).populate('products').select({products: 1, _id:0});
        } catch (error) {
            logger.error(error);
            return new Error(`There was an error fetching products from cart with id ${id}. Error: ${error.message}`);
        };
    };
};
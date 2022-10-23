'use strict';

import { CartsModel } from '../models/cart.model.js';
import { DBDao } from './DBDao.js';

export class CartService extends DBDao {
    ID_FIELD = '_id';

    static getInstance() {
        return new CartService();
    };

    constructor() {
        if (typeof CartService.instance === 'object') {
            return CartService.instance;
        };
        super();
        CartService.instance = this;
        return this;
    };
    
    async create() {
        try {
            return await CartsModel.create({});
        } catch (error) {
            this.logger.error(error);
            return false;
        };
    };

    async getAll() {
        try {
            return await CartsModel.find();
        } catch (error) {
            this.logger.error(error);
            return false;
        };
    };
    
    async deleteById(id) {
        try {
            return await CartsModel.findByIdAndDelete({[this.ID_FIELD]: id});
        } catch (error) {
            this.logger.error(error);
            return false;
        };
    };
    
    async saveProductToCart(id, obj) {
        try {
            const cart = await CartsModel.findById(id);
            cart.products.push(obj.productId);
            cart.save();
            return true;
        } catch (error) {
            this.logger.error(error);
            return false;
        };
    };
    
    async deleteProductFromCart(id, productId) {
        try {
            const cart = await CartsModel.findById(id);
            cart.products.remove(productId);
            cart.save();
            return true;
        } catch (error) {
            this.logger.error(error);
            return false;
        };
    };
    
    async getAllProductsFromCart(id) {
        try {
            return await CartsModel.findById(id).populate('products').select({products: 1, _id: 0});
        } catch (error) {
            this.logger.error;
            return false;
        };
    };
};
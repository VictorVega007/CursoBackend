'use strict';

import { CartService } from '../services/cart.service.js';
import { ProductService } from '../services/product.service.js';

const cartService = new CartService();

export const create = async (req, res) => {
    const newCart = await cartService.createCart();

    newCart
        ? res.status(200).json({'success': 'Cart created successfully with id ' + newCart._id})
        : res.status(500).json({'error': 'Cart could not be created successfully'});
};

export const remove = async (req, res) => {
    const { id } = req.params;
    const cartDeleted = await cartService.deleteCartById(id);

    cartDeleted
        ? res.status(200).json({'success': 'The cart was successfully deleted'})
        : res.status(404).json({'error': 'The cart could not be deleted'});
};

export const addProduct = async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    const productExists = await ProductService.exists(body.productId);
    
    if(productExists) {
        await cartService.saveProductToCart(id, body);
    } else {
        res.status(404).json({'error': 'Product not found'});
    };
};

export const getProducts = async (req, res) => {
    const { id } = req.params;
    const cartProducts = await cartService.getAllProductsFromCart(id);

    cartProducts
        ? res.status(200).json({cartProducts})
        : res.status(404).json({'error': 'Cart not found'});
};

export const removeProduct = async (req, res) => {
    const { id, id_prod } = req.params;

    const productDeleted = await cartService.deleteProductFromCart(id, id_prod);

    productDeleted
        ? res.status(200).json({'success': 'Product deleted successfully'})
        : res.status(400).json({'error': 'Product not found.'});
};
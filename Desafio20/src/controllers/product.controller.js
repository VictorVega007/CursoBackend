'use strict';

import { ProductService } from '../services/product.service.js';

const productService = new ProductService.getInstance();

export const getAll = async (req, res) => {
    const products = await productService.getAll();

    products
        ? res.status(200).json(products)
        : res.status(400).json({'error': 'Error to get all products'});
};

export const getById = async (req, res) => {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    product
        ? res.status(200).json(product)
        : res.status(400).json({'error': 'Product not found'});
};

export const create = async (req, res) => {
    const { body } = req;
    const newProduct = await productService.create(body);

    newProduct
        ? res.status(200).json({'success': 'Product added with id: ' + newProduct._id})
        : res.status(400).json({'error': 'Please verify the body of schema'});
};

export const update = async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const productUpdated = await productService.updateProductById(id, body);

    productUpdated
        ? res.status(200).json({'success': 'Product updated successfully'})
        : res.status(404).json({'error': 'Product not found'});
};

export const remove = async (req, res) => {
    const { id } = req.params;
    const productDeleted = await productService.deleteById(id);

    productDeleted
        ? res.status(200).json({'success': 'Product deleted successfully'})
        : res.status(404).json({'error': 'Product not found'});
};
'use strict';

const express = require('express');
const { Router } = express;
const productsRouter = Router();

const validateSession = require('../utils/sessionValidator');

const {
    getProductById,
    addProduct,
    editProduct,
    deleteProduct,
} = require('../controllers/productController');

// RUTAS PRODUCTOS

// Obtiene lista de productos o un sólo producto por su id
productsRouter.get('/:id?', validateSession, getProductById);

// Agregar un producto al listado de productos
productsRouter.post('', validateSession, addProduct);

// Modifica un producto del listado de productos según su id
productsRouter.put('/:id', validateSession, editProduct);

// Elimina un producto del listado de productos según su id
productsRouter.delete('/:id', validateSession, deleteProduct);

module.exports = productsRouter;
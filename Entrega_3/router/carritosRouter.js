'use strict';

const express = require('express');
const { Router } = express;
const dotenv = require('dotenv');
dotenv.config();

const carritoRouter = Router();
const validateSession = require('../utils/sessionValidator');
const {
    getUsersCart,
    createCart,
    deleteCart,
    getProductsFromCart,
    addProductsToCart,
    deleteProductFromCart,
    finishPurchase
} = require('../controllers/cartController');

// RUTAS CARRITO

// Busca los carritos asociados al usuario
carritoRouter.get('', validateSession, getUsersCart);

// Crea nuevo carrito
carritoRouter.post('', validateSession, createCart);

// Elimina un carrito especifico
carritoRouter.delete('/:id', validateSession, deleteCart);

// Obtener los productos de un carrito específico por su id
carritoRouter.get('/:id/productos', validateSession, getProductsFromCart);

// Agregar producto a un carrito específico por su id
carritoRouter.post('/:id/productos', validateSession, addProductsToCart);

// Eliminar un producto de un carrito específico por su id
carritoRouter.eliminate('/:id/productos/:id_prod', validateSession, deleteProductFromCart);

// Realizar la orden de compra
carritoRouter.post('/buy', validateSession, finishPurchase);

module.exports = carritoRouter;
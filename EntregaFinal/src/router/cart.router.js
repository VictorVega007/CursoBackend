const express = require('express')
const { Router } = express

const dotenv = require('dotenv')
dotenv.config()

const validateSession = require('../utils/sessions/session.validator')

const cartRouter = Router()

const {
    getUsersCart,
    getUsersCartByStatus,
    createCart,
    deleteCart,
    getProductsFromCart,
    addProductToCart,
    deleteProductFromCart,
    finishPursache
} = require('../controllers/cart.controller')

// RUTAS CARRITO

// Obtener carritos asociados al usuario
cartRouter.get('', validateSession, getUsersCart)

// Obtener carritos asociados al usuario y según el status del carrito
cartRouter.get(':/status', validateSession, getUsersCartByStatus)

// Crea un nuevo carrito
cartRouter.post('', validateSession, createCart)

// Elimina un carrito por su id
cartRouter.delete(':/id', validateSession, deleteCart)

// Obtener los productos de un carrito por su id
cartRouter.get('/:id/productos', validateSession, getProductsFromCart)

// Agregar productos a un carrito específico por su id
cartRouter.post('/:id/productos', validateSession, addProductToCart)

// Eliminar productos de un carrito específico por su id
cartRouter.delete(':/id/productos/:id_prod', validateSession, deleteProductFromCart)

// Finalizar compra
cartRouter.post('/buy', validateSession, finishPursache)

module.exports = cartRouter
const express = require('express')
const { Router } = express
const productRouter = Router()

const validateSession = require('../utils/sessions/session.validator')
const {
    getProductById,
    addProduct,
    editProduct,
    deleteProduct
} = require('../controllers/product.controller')

// RUTAS PARA PRODUCTO

// Obtener listado de productos o un producto específico por su id
productRouter.get('/:id?', validateSession, getProductById)

// Agregar un producto al listado de productos
productRouter.post('', validateSession, addProduct)

// Modifica un producto del listado según su id
productRouter.put('/:id', validateSession, editProduct)

// Elimina un producto del listado por su id
productRouter.delete('/:id', validateSession, deleteProduct)

module.exports = productRouter
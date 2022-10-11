'use strict';

import express from "express";
import * as cartController from '../controllers/cart.controller.js'

const router = express.Router();

// GET /api/carrito/:id/productos
router.get('/:id/productos', cartController.getProducts);

// POST /api/carrito
router.post('/', cartController.create);

// POST /api/carrito/:id/productos
router.post('/:id/productos', cartController.addProduct);

// DELETE /api/carrito/id
router.delete('/:id', cartController.remove);

// DELETE /api/carrito/:id/productos/:id_prod
router.delete('/:id/productos/:id_prod', cartController.removeProduct)

export default router;
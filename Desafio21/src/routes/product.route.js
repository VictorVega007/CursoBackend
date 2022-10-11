'use strict';

import express from 'express';
import auth from '../middlewares/auth.middleware.js';
import * as productController from '../controllers/product.controller.js';

const router = express.Router();

// GET api/productos
router.get('/', productController.getAll);

// GET api/productos/:id
router.get('/:id', productController.getById);

// POST api/productos
router.post('/', auth, productController.create);

// PUT api/productos/:id
router.put('/:id', productController.update);

// DELETE /api/productos/id
router.delete('/:id', auth, productController.remove);

export default router;
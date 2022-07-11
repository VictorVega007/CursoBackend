'use strict';

import express from 'express';
import dotenv from 'dotenv';
import { ProductoDao } from './dao/ProductoDao.js';
import { CarritoDao } from './dao/CarritoDao.js';
import { ProductoCarritoDao } from './dao/ProductoCarritoDao.js';
// import knex from 'knex';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authMiddleWare = (req, res, next) => {
    req.header('authorization') === process.env.TOKEN
        ? next()
        : res.status(401).json({'error': 'unauthorized'})
}

const routerProducts = express.Router();
const routerCart = express.Router();

const productoDao = new ProductoDao();
const carritoDao = new CarritoDao();
const productoCarritoDao = new ProductoCarritoDao();

routerProducts.get('/', async (req, res) => {
    const products = await productoDao.getAll();
    res.status(200).json(products);
})

routerProducts.get('/:id', async (req, res) => {
    const { id } = req.params;
    const product = await productoDao.getProductById(id);

    product 
        ? res.status(200).json(product)
        : res.status(400).json({'error': 'Product not found'});
})

routerProducts.post('/', authMiddleWare, async (req, res) => {
    const { body } = req;

    body.timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const newProductId = await productoDao.save(body);

    newProductId
        ? res.status(200).json({'succes': 'product added successfully with id ' + newProductId})
        : res.status(400).json(({'error': 'Some key may is wrong. Please verify the body content'}))
})

routerProducts.put('/:id', authMiddleWare, async (req, res) => {
    const { id } = req.params;
    const body = req;
    const wasUpdated = await productoDao.updateProductById(body, id);

    wasUpdated
        ? res.status(200).json({'success': 'product updated successfully'})
        : res.status(400).json({'error': 'product update failed'});
})

routerProducts.delete('/:id', authMiddleWare, async (req, res) => {
    const { id } = req.params;
    const wasDeleted = await productoDao.deleteById(id);

    wasDeleted
        ? res.status(200).json({'success': 'product deleted successfully'})
        : res.status(400).json({'error': 'product delete failed'});
})

routerCart.post('/', async (req, res) => {
    const newCartId = await carritoDao.save();

    newCartId
        ? res.status(200).json({'succes': 'cart added successfully' + newCartId})
        : res.status(400).json({'error': 'cart add failed'});
})

routerCart.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const wasDeleted = await carritoDao.deleteById(id);

    wasDeleted
        ? res.status(200).json({'success': 'cart successfully deleted'})
        : res.status(400).json({'error': 'cart delete failed'});
})

routerCart.post('/:id/productos', async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    if (Object.prototype.hasOwnProperty.call(body, 'productId')) {
        const newProductoCarritoId = await productoCarritoDao.saveProductToCart(id, body.productId);

        newProductoCarritoId
            ? res.status(200).json({'succes': 'product added successfully to cart'})
            : res.status(400).json({'error': 'product add failed'});
    } else {
        res.status(400).json({'error': 'the key must be productId, verify'});
    }
})

routerCart.delete('/:id/productos/:id_prod', async (req, res) => {
    const { id, id_prod } = req.params;
    const wasDeleted = await productoCarritoDao.deleteProductFromCart(id, id_prod);

    wasDeleted
        ? res.status(200).json({'success': 'product deleted successfully from cart'})
        : res.status(400).json({'error': 'product delete failed'})
})

routerCart.get(':id/productos', async (req, res) => {
    const { id } = req.params;
    const cartProducts = await productoCarritoDao.getAllProductsFromCart(id);

    if(cartProducts.length) {
        res.status(200).json(cartProducts);
    } else {
        res.status(400).json({'error': 'no products found'});
    }
})

const PORT = 1234;
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando el puerto ${PORT}`);
})

server.on('error', (err) => console.log(err));
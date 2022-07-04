'use strict';

const express = require('express');
const  { Router } = require('express');
const routerCarrito = Router();

const Cart = require('../api/apiCart');
const cartContainer = new Cart('data/carrito.json');

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

routerCarrito.get('/', async (req, res) => {
	const arrayCart = await cartContainer.getCart();
	res.json(arrayCart);
});

routerCarrito.get('/:id/productos', async (req, res) => {
	const identificador = req.params;
	const response = await cartContainer.getCartProductsById(identificador);
	res.json(response);
});

routerCarrito.post('/', async (req, res) => {
	const response = await cartContainer.createCart();
	res.json(response);
});

routerCarrito.post('/:id/productos/:id_prod', async (req, res) => {
	const cart = req.params.id;
	const prod = req.params.id_prod;
	const response = await cartContainer.addProductById(cart, prod);
	res.json(response);
});

routerCarrito.delete('/:id', async (req, res) => {
	const identificador = req.params;
	const response = await cartContainer.deleteCart(identificador);
	res.json(response);
});

routerCarrito.delete('/:id/productos/:id_prod', async (req, res) => {
	const cart = req.params.id;
	const prod = req.params.id_prod;
	const response = await cartContainer.deleteProductById(cart, prod);
	res.json(response);
});

module.exports = { routerCarrito };
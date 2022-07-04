'use strict';

const express = require('express');
const  { Router } = require('express');
const { getCart, createCart, deleteCart, getCartProductsById, addProductById, deleteProductById } = require('../api/apiCart');

const routerCarrito = Router();

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

routerCarrito.get('/', async (req, res) => {
	const arrayCart = await getCart();
	res.json(arrayCart);
});

routerCarrito.get('/:id/productos', async (req, res) => {
	const identificador = req.params;
	const response = await getCartProductsById(identificador);
	res.json(response);
});

routerCarrito.post('/', async (req, res) => {
	const response = await createCart();
	res.json(response);
});

routerCarrito.post('/:id/productos/:id_prod', async (req, res) => {
	const cart = req.params.id;
	const prod = req.params.id_prod;
	const response = await addProductById(cart, prod);
	res.json(response);
});

routerCarrito.delete('/:id', async (req, res) => {
	const identificador = req.params;
	const response = await deleteCart(identificador);
	res.json(response);
});

routerCarrito.delete('/:id/productos/:id_prod', async (req, res) => {
	const cart = req.params.id;
	const prod = req.params.id_prod;
	const response = await deleteProductById(cart, prod);
	res.json(response);
});

module.exports = { routerCarrito };
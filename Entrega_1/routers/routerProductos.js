'use strict';

const express = require('express');
const { Router } = require('express');
const routerProductos = Router();
const isAdmin = require('../middleware/isAdmin');

const productsContainer = require('../api/apiProducts');
const container = new productsContainer('data/productos.json');

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

routerProductos.get('/', async (req, res) => {
	const arrayProductos = await container.getProducts();
	// res.json(arrayProductos);
	res.render('pages/listOfProducts', { arrayProductos });
});

routerProductos.get('/:id', (req, res) => {
	res.render('pages/form', {});
})

routerProductos.get('/:id', async (req, res) => {
	const id = req.params;
	const response = await container.getProductById(id);
	res.json(response);
});

routerProductos.post('/', async (req, res) => {
	const administrador = isAdmin();

	if (administrador) {
		const product = req.body;
		const response = await container.saveProduct(product);
		res.json(response);
	} else {
		const response = { error: '-1', descripcion: "Ruta '/api/productos' método 'POST' no autorizada" }
		res.json(response);
	}
});

routerProductos.put('/:id', async (req, res) => {
	const administrador = isAdmin();

	if (administrador) {
		const product = req.body;
		const id = req.params;
		const response = await container.updateProduct(product, id);
		res.json(response);
	} else {
		const response = { error: '-1', descripcion: "Ruta '/api/productos/:id' método 'PUT' no autorizada" };
		res.json(response);
	}
});

routerProductos.delete('/:id', async (req, res) => {
	const administrador = isAdmin();

	if (administrador) {
		const id = req.params
		const response = await container.deleteProduct(id)
		res.json(response)
	} else {
		const response = { error: '-1', descripcion: "Ruta '/api/productos/:id' método 'DELETE' no autorizada" };
		res.json(response);
	}
});

module.exports = { routerProductos };
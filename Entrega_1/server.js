'use strict';

const express = require('express');
const { routerProductos } = require('./routers/routerProductos');
const { routerCarrito } = require('./routers/routerCarrito');

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
	
app.use('/productos', (req, res) => {
	res.render('productos');
});

app.use('/carrito', (req, res) => {
	res.render('carrito');
});

app.use('/api/productos', routerProductos);

app.use('/api/carrito', routerCarrito);

app.get('*', (req, res) => {
	res.render('home');
});

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});

server.on('error', error => console.log(`Error en el servidor ${error}`));
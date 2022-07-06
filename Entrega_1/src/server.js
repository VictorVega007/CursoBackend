'use strict';

const express = require('express');
const { routerProductos } = require('../routers/routerProductos');
const { routerCarrito } = require('../routers/routerCarrito');
const path = require('path');
const { engine } = require('express-handlebars');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'hbs');

app.engine('hbs', engine({
	extname: '.hbs',
	defaultLayout: 'main.hbs',
	layoutsDir: path.join(__dirname, '/views/layouts'),
    partialsDir:path.join(__dirname, '/views/partials')
}))
	
app.use('/productos', (req, res) => {
	res.render('productos');
});

app.use('/carrito', (req, res) => {
	res.render('carrito');
});

app.use('/api/productos', routerProductos);

app.use('/api/carrito', routerCarrito);

app.use( (req, res) => {
	res.status(400).send('Ruta inexistente');
});

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});

server.on('error', error => console.log(`Error en el servidor ${error}`));
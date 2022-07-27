'use strict';

import express from 'express';
import productRouter from './router/productsRouter.js';
import cartRoute from './router/cartsRouter.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/productos', productRouter);
app.use('/api/carrito', cartRoute);

app.all('*', (req, res) => {
    return res.status(404).json(`La ruta ${req.path} no existe`);
});

const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando el puerto: ${PORT}`);
});

server.on('error', err => console.log(`Error en el servidor: ${err.message}`));
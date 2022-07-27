'use strict';

// import express, { request } from 'express';
import { Router } from 'express';
import getStorage from '../db/daos/index.js';

const cartRoute = Router();
const authorizationLevel = 0;
const { carts: storage } = getStorage();

console.log(storage)

//Crear carrito

cartRoute.post('', async (req, res) => {
    if (authorizationLevel === 0 || authorizationLevel === 1) {
        try {
            const answer = await storage.save(req.body);
            return res.status(200).json(answer);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        };
    } else {
        return res.status(401).json({ url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message: `Ruta '${req.originalUrl}, metodo '${req.method}' no autorizada para el usuario`});
    };
});

//Eliminar carrito por id

cartRoute.delete('/:id', async (req, res) => {
    if (authorizationLevel === 0 || authorizationLevel === 1) {
        try {
            const answer = await storage.deleteById((req.params.id), null);
            return res.status(200).json(answer);
        } catch (error) {
            return res.status(500).json(error.message);
        };
    } else {
        return res.status(401).json({ url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message: `Ruta '${req.originalUrl}, metodo '${req.method}' no autorizada para el usuario`});
    };
});

//Obtener todos los carritos

cartRoute.get('/', async (req, res) => {
    try {
        const answer = await storage.getAll(null);
        return res.status(200).json(answer);
    } catch (error) {
        return res.status(500).json(error.message);
    }
})

//Obtener productos de un carrito por el id del carrito

cartRoute.get('/:id/productos', async (req, res) => {
    if (authorizationLevel === 0 || authorizationLevel === 1) {
        if (!req.params.id) {
            return res.status(500).json(`El carrito con id ${req.params.id} no existe`);
        };
        try {
            const data3 = await storage.getAll((req.params.id))
            return res.status(200).json(data3);
        } catch (error) {
            return res.status(500).json(error.message);
        };
    } else {
        return res.status(401).json({ url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message: `Ruta '${req.originalUrl}, metodo '${req.method}' no autorizada para el usuario`});
    };
});

//Agregar producto al carrito por id

cartRoute.post('/:id/productos', async (req, res) => {
    if (authorizationLevel === 0) {
        try {
            const answer = await storage.updateById((req.params.id), req.body);
            return res.status(201).json(answer);
        } catch (error) {
            return res.status(500).json(error.message);
        };
    } else {
        return res.status(401).json({ url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message: `Ruta '${req.originalUrl}, metodo '${req.method}' no autorizada para el usuario`});
    };
});

//Eliminar producto de carrito por id 

cartRoute.delete('/:id/productos/:id_prod', async (req, res) => {
    if (authorizationLevel === 0 || authorizationLevel === 1) {
        try {
            const answer = await storage.deleteById((req.params.id), (req.params.id_prod));
            return res.status(201).json(answer);
        } catch (error) {
            return res.status(500).json(error.message);
        };
    } else {
        return res.status(401).json({ url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message: `Ruta '${req.originalUrl}, metodo '${req.method}' no autorizada para el usuario`});
    };
});

export default cartRoute;
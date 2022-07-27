'use strict';

import express from 'express';
import { Router } from 'express';
import getStorage from '../db/daos/index.js';

const productRouter = Router();
const authorizationLevel = 0;
const { products: storage } = getStorage();

//Obtener listado de productos o un producto específico por su id

productRouter.get('/:id?', async (req, res) => {
    if (authorizationLevel === 0 || authorizationLevel === 1) {
        if(req.params.id) {
            try {
                const data3 = await storage.getById((req.params.id));
                return res.status(200).json(data3);
            } catch (error) {
                return res.status(500).json(error.message);
            };
        };

        try {
            const data3 = await storage.getAll(null);
            return res.status(200).json(data3);
        } catch (error) {
            return res.status(500).json(error.message);
        };       
    } else {
        return res.status(401).json({ url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message: `Ruta '${req.originalUrl}, metodo '${req.method}' no autorizada para el usuario`});
    };
});

//Agregar un producto a la lista de productos

productRouter.post('', async (req, res) => {
    if(authorizationLevel === 0) {
        try {
            const answer = await storage.save(req.body);
            return res.status(201).json(answer);
        } catch (error) {
            return res.status(500).json(error.message);
        };
    } else {
        return res.status(401).json({ url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message: `Ruta '${req.originalUrl}, metodo '${req.method}' no autorizada para el usuario`});
    };
});

//Modifica un producto del listado por su id

productRouter.put('/:id', async (req, res) => {
    if(authorizationLevel === 0) {
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

//Elimina un producto del listado por su id de producto

productRouter.delete('/:id', async (req, res) => {
    if(authorizationLevel === 0) {
        try {
            const answer = await storage.deleteById((req.params.id), null);
            return res.status(201).json(answer);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    } else {
        return res.status(401).json({ url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message: `Ruta '${req.originalUrl}, metodo '${req.method}' no autorizada para el usuario`});
    };
});

export default productRouter;
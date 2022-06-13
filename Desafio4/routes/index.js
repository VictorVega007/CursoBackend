'use strict';

const Container = require('../src/container');
const container = new Container('productos.json');
const { Router } = require('express');
const router = Router();

router.get('/', async (req, res) => {
    const products = await container.getAll();
    res.status(200).json(products);
})

router.get('/:id', async (req, res) =>{
    const { id } = req.params;
    const product = await container.getById(id);

    if(product) {
        res.status(200).json(product)
    } else {
        res.status(404).json({error: `El producto con id ${id} no existe`})
    }
})

router.post('/', async (req, res) => {
    const { body } = req;
    const newProductWithId = await container.save(body);
    res.status(200).send(`Producto agregado con éxito con el id ${newProductWithId}`);
})

router.put('/:id', async(req, res) =>{
    const { id } = req.params;
    console.log(id)

    const { body } = req;
    console.log(body)

    const productUpdated = await container.updateById(id, body);
    console.log(productUpdated)

    if (productUpdated) {
        res.status(200).send(`Producto con id: ${id} actualizado`);
    } else {
        res.status(404).send(`Producto con id: ${id} no actualizado`);
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const productDeleted = await container.deleteById(id);

    if(productDeleted) {
        res.status(200).send(`El producto con id: ${id} fue eliminado con éxito`);
    } else {
        res.status(404).send(`El producto con id: ${id} no pudo eliminarse`);
    }
})

module.exports = router;
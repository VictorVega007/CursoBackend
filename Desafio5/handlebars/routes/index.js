'use strict';

const { Router } = require('express');
const router = Router();
const Container = require('../src/container');
const container = new Container('productos.json');


router.get('/productos', async (req, res) => {
    const products = await container.getAll();
    res.render('pages/listOfProducts', { products });
});

router.post('/productos', async (req, res) => {
    const { body } = req;
    await container.save(body);
    res.redirect('/')
}); 

router.get('/', async (req, res) => {
    res.render('pages/form', {})
})


module.exports = router;
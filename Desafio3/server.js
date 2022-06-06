'use strict';

const Container = require('./container.js');
const container = new Container('products.json');

const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.status(200).send('Welcome to homepage');
})

app.get('/productos', async (req, res) => {
    const products = await container.getAll();
    res.json(products);
})

app.get('/productoRandom', async(req, res) =>{
    const products = await container.getAll();
    const allItems = products.length
    const randomProduct = await container.getById(showRandomProduct(1, allItems))

    res.json(randomProduct)
})

const showRandomProduct = (min, max) => {
    return Math.floor((Math.random() * (max - min + 1) + min))
}


app.listen(port, () => {
    console.log(`The server is listening the port ${port}`);
})

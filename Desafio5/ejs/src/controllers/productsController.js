'use strict';

const Container = require('../container');
const container = new Container('productos.json');

const getProducts = async (req, res) => {
    const products = await container.getAll();
    res.render('pages/list', { products });
};

const postProducts = async (req, res) => {
    const { body } = req;
    await container.save(body);
    res.redirect('/');
};


module.exports = {
    getProducts,
    postProducts
};
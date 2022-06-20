'use strict';

const { Router } = require('express');
const router = Router();
const { getProducts, postProducts } = require('../controllers/productsController');

router.get('/productos', getProducts);
router.post('/productos', postProducts);

router.get('/', (req, res) => {
    res.render('pages/form', {});
});

module.exports = router;
'use strict';

const express = require('express');
const app = express();
const routers = require('../routes/index')
const port = 6065;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routers);

app.use(express.static('public'));

app.set('views', './src/views');
app.set('view engine', 'pug');

app.listen(port, () => {
    console.log(`Servidor escuchando el puerto ${port}`);
});

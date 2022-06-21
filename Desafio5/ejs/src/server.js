'use strict';

const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const routes = require('./routes/index')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use('/', routes);

app.listen(port, () => {
    console.log(`Servidor escuchando puerto ${port}`);
});
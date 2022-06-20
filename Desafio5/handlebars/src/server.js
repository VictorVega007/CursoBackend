'use strict';

const express = require('express');
const { engine } = require('express-handlebars');
const routes = require('../routes/index');
const app = express();
const port = 8080;
const path = require('path');


app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static('public'));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'hbs');

app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main.hbs',
    layoutsDir: path.join(__dirname, '/views/layouts'),
    partialsDir:path.join(__dirname, '/views/partials') 
}));

app.use('/', routes);

app.listen(port, () => {
    console.log(`Servidor escuchando el puerto ${port}`);
});
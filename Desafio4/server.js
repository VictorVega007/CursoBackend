'use strict';

const express = require('express');
const app = express();
app.use(express.static('public'));
const routers = require('./routes/index')
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/productos', routers);

app.listen(port, err => {
    if(err) {
        console.log(`Hubo un error al iniciar servidor ${err}`)
    } else {

        console.log(`Escuchando puerto ${port}`)
    }
})


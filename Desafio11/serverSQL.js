'use strict';

const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer} = require('socket.io');
const { optionsMariaDB } = require('./db/mariaDB');
const { optionsSQLite3 } = require('./db/SQLite3');
  
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = 3000;

const { Router } = express;
const apiRouter = Router();

let productArray = []

let messageArray = []

let usersArray = [];

const Contenedor = require('./db/containers/containerSQL');
const products = new Contenedor(productArray, optionsMariaDB, 'productos');
const messages = new Contenedor(messageArray, optionsSQLite3, 'chat');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/static', express.static(__dirname + '/public'));
app.use('/api/productos', apiRouter);

app.set('views', './public/views/ejs');
app.set('view engine', 'ejs');

apiRouter.get('', async (req, res) => { 
    const data3 = await products.getAll();
    const messageCont = await messages.getAll();

    return res.render('home', {
        status:1, 
        data3,
        messageCont
    });
});

// ==== TESTING ROUTE ====
apiRouter.get('/test', async (req, res) => { 
    const data3 = getAll(5);
    console.log(data3);
    const messageCont = await messages.getAll();

    return res.render('home', {
        status:1, 
        data3,
        messageCont,
    });
});

const server = httpServer.listen(PORT, () => {
    console.log(`Server listening on: ${server.address().port}`);
});

server.on('error',(error) => {console.log(`Se ha detectado un error`)});

io.on('connection', socket => {
    console.log(`New client connected: ${socket.id}`);
    usersArray.push(socket.id);

    socket.on('addProduct', async (newProduct) => {
        const newProductID = await products.save(newProduct);
        const data3 = newProduct;
        data3.id = newProductID;
        socket.emit('refreshList', data3);
        socket.broadcast.emit('refreshList', data3);
    })

    socket.on('addMessage', newMessage => {
        messages.save(newMessage);
        const messageCont = newMessage;
        socket.emit('refreshMessages', messageCont);
        socket.broadcast.emit('refreshMessages', messageCont);
    })

    socket.on('disconnect', reason => {
        usersArray = usersArray.filter(user => user != socket.id);
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// ==== FUNCION PARA TESTING ====
const { faker } = require('@faker-js/faker');
faker.locale = 'es'

const getAll = (arrayLength) => {
    console.log('test requested')
    const arrayProductos = []
    for (let i = 0; i < arrayLength; i++){
        const newProduct = {
            title:faker.commerce.productName(),
            price:faker.commerce.price(),
            thumbnail: faker.image.imageUrl(),
            id: faker.datatype.number()
        }
        arrayProductos.push(newProduct)
    }
    return arrayProductos
}
'use strict';

const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const normalizr = require('normalizr');
const normalizrChatSchema = require('./public/normalizrSchema');

const { Router } = express;
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
let usersArray = [];
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(__dirname + '/public'));

// ==== SET DATABASE ====
const uri = "mongodb+srv://victor:victor123@cluster0.5tx05.mongodb.net/desafio?retryWrites=true&w=majority";

// ==== SCHEMAS ====
const messagesSchema = require('./db/schema/mensajes');
const productsSchema = require('./db/schema/productos');

// ==== DAOS ====
const MessagesDAOMongoDB = require('./db/daos/MensajesDAOMongoDB');
const ProductsDAOMongoDB = require('./db/daos/ProductosDAOMongoDB');

// ==== CONTENEDORES (CHILD) ====
const messages = new MessagesDAOMongoDB('mensaje', messagesSchema, uri);
const products = new ProductsDAOMongoDB('producto', productsSchema, uri);

// ==== SET ROUTES ====
const apiRouter = Router();
app.use('/api/productos', apiRouter);

apiRouter.get('', async (req, res) => {
    const data3 = await products.getAll();
    const messageCont = await messages.getAll();
    const normalizedChat = normalizr.normalize(messageCont, normalizrChatSchema);

    const origLength = JSON.stringify(messageCont).length;
    const normLength = JSON.stringify(normalizedChat).length;

    console.log(messageCont);
    console.log(normalizedChat);
    console.log('ORIGINAL: ', origLength);
    console.log('NORMALIZADO: ', normLength);

    return res.render('home', {
        status: 1,
        data3,
        messageCont,
        origLength,
        normLength
    });
});

// ==== SET VIEWS CONFIG ====
app.set('views', './public/views/ejs');
app.set('view engine', 'ejs');

// ==== SET HTTP SERVER ====
app.all('*', (req, res) => {
    return res.status(404).json(`Ruta '${req.path}' no encontrada.`);
});

const server = httpServer.listen(PORT, () => {
    console.log(`Server listening on ${server.address().port}`);
});

server.on('error',(error) => {console.log(`Error in server. ${error}`)});

// ==== SET SOCKET SERVER ====
io.on('connection', socket => {
    console.log(`New client connected ${socket.id}`);
    usersArray.push(socket.id);

    socket.on('addProduct', async (newProduct) => {
        const newProductID = await products.save(newProduct);
        const data3 = newProduct;
        data3.id = newProductID;
        socket.emit('refreshList', data3);
        socket.broadcast.emit('refreshList', data3);
    });

    socket.on('addMessage', newMessage => {

        messages.save(newMessage);
        const messageCont = newMessage;
        socket.emit('refreshMessages', messageCont);
        socket.broadcast.emit('refreshMessages', messageCont);
    });

    socket.on('disconnect', reason => {
        usersArray = usersArray.filter(user => user != socket.id);
        console.log(`Client disconnected: ${socket.id}`);
    });
});

'use strict';

const express = require('express');
const app = express();
const port = 8080;
const expressServer = app.listen(port, () => {console.log(`Servidor escuchando el puerto ${port}`)});
const { Server: IOServer } = require('socket.io');
const io = new IOServer(expressServer);

const { engine } = require('express-handlebars');
const routes = require('../routes/index');
const path = require('path');

const Container = require('./container');
const container = new Container('productos.json');
const chat = new Container('chat.json');

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

io.on('connection', async(socket) => {
    console.log('🟢 User online')
    
    const products = await container.getAll();
    socket.emit('welcomeList', products );
    
    const messages = await chat.getAll();
    socket.emit('welcomeMessageList', messages);
    
    socket.on('newMessage', async(data) => {
        await chat.save(data);
        
        const messages = await chat.getAll();
        io.sockets.emit('messageListUpdated', messages);
    });

    socket.on('productAdded', async(data) => {
        console.log('Se hizo click en agregar');
        await container.save(data);
        
        const products = await container.getAll();
        io.sockets.emit('listUpdated', products);
    })
    
    socket.on('disconnect', () => {
        console.log('🔴 User offline');
    });
});

app.use('/', routes);
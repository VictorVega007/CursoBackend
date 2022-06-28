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

const Container = require('./container')
const container = new Container('productos.json');
const chat = new Container('chat.json')

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
    console.log('🟢 Usuario conectado')
    
    const productos = await container.getAll();
    socket.emit('bienvenidoLista', productos )
    
    const mensajes = await chat.getAll();
    socket.emit('listaMensajesBienvenida', mensajes)
    
    socket.on('nuevoMensaje', async(data) => {
        await chat.save(data);
        
        const mensajes = await chat.getAll();
        io.sockets.emit('listaMensajesActualizada', mensajes)
    })

    socket.on('productoAgregado', async(data) => {
        console.log('Alguien presionó el click')
        await container.save(data);
        
        const productos = await container.getAll();
        io.sockets.emit('listaActualizada', productos);
    })
    
    socket.on('disconnect', () => {
        console.log('🔴 Usuario desconectado')
    })
    
})

app.use('/', routes);
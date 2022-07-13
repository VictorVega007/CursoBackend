/* MODULOS */
const express = require('express');
const { get } = require('express/lib/response');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const Container = require('./src/containers/Container');
const { optionsMySQL } = require('./src/utils/optionsMySQL');
const { optionsSQLite } = require('./src/utils/optionsSQLite');

const tableProducts = 'products';
const tableMessages = 'messages';

/* INSTANCIACION */
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const apiProducts = new Container(optionsMySQL, tableProducts);
const apiMessages = new Container(optionsSQLite, tableMessages);


app.get('/', (req, res) => {res.render('index');})


/* WEBSOCKET */
io.on("connection", async (socket) => {
    console.log(`Nuevo cliente conectado ${socket.id}`);
    //------- Enviar histórico de productos
    socket.emit('products', await apiProducts.listAll());
  
    //------- Escuchar nuevos productos
    socket.on('newProduct', async (product) => {
      await apiProducts.save(product);
  
      //Actualización de la vista de productos
      io.sockets.emit('products', await apiProducts.listAll());
    });
  
    //------- Enviar histórico de mensajes
    socket.emit('messages', await apiMessages.listAll());
  
    //------- Escuchar nuevos mensajes
    socket.on('newMessage', async (msg) => {
      msg.date = new Date().toLocaleString();
      await apiMessages.save(msg);
  
      //Actualización de la vista de mensajes
      io.sockets.emit('messages', await apiMessages.listAll());
    });
});

/* MIDDLEWARES */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', './public/views');


  /* SERVIDOR */
const PORT = 8080;

const server = httpServer.listen(PORT, () => {
  console.log(`Servidor http escuchado en puerto ${server.address().port}`);
});

server.on('error', (error) => console.error(`Error en servidor ${error}`));
'use strict';

const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const { Router } = express;
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const session = require('express-session');
const PORT = 8080;

const MongoStore = require('connect-mongo');

// ==== Session Middleware ====
const validateSession = (req, res, next) => {
    if (req.session.user && req.session.password) {
        console.log(`Usuario válido. Sesión iniciada por: ${req.session.user}`);
        return next();
    };

    if (req.body.user && req.body.password) {
        req.session.user = req.body.user;
        req.session.password = req.body.password;
        console.log(`Se ha registrado el usuario ${req.session.user}`);
        return next();
    };

    console.log('No existe el usuario. Inicie sesión');

    return res.status(401).redirect('http://localhost:8080/login');
};

// ==== Set Middlewares ====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(__dirname + '/public'));

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://victor:victor123@cluster0.5tx05.mongodb.net/desafio?retryWrites=true&w=majority',
        ttl: 60
    }),
    secret: 'qwerty',
    resave: true,
    saveUninitialized: true,
}));

// ==== Data base =====
const uri = 'mongodb+srv://victor:victor123@cluster0.5tx05.mongodb.net/desafio?retryWrites=true&w=majority';

// ==== Schemas =====
const messagesSchema = require('./db/schema/mensajes');
const productsSchema = require('./db/schema/productos');

// ==== Daos ====
const MessagesDAOMongoDB = require('./db/daos/MensajesDAOMongoDB');
const ProductsDAOMongoDB = require('./db/daos/ProductosDAOMongoDB');

// ==== Containers (CHILD) ====
const messages = new MessagesDAOMongoDB('mensaje', messagesSchema, uri);
const products = new ProductsDAOMongoDB('producto', productsSchema, uri);

// ==== Set Routes ====
const apiRouter = Router();
const loginRouter = Router();
const logoutRouter = Router();

app.use('/api/productos', apiRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);

apiRouter.get('', validateSession, async (req, res) => {
    const data3 = await products.getAll();
    const messageCont = await messages.getAll();
    const user = req.session.user;

    return res.render('home', {
        status: 1, 
        data3,
        messageCont,
        user
    });
});

loginRouter.get('', (req, res) => {
    return res.render('login');
});

loginRouter.post('/auth', validateSession, (req, res) => {
    return res.status(200).redirect('http://localhost:8080/api/productos');
});

logoutRouter.get('', (req, res) => {
    const user = req.session.user;
    if (req.session.user && req.session.password) {
        return req.session.destroy(err => {
            if (!err) {
                return res.status(200).render('redirect', { user });
            };
            res.send({ error: err });
        });
    };
    return res.status(404).redirect('http://localhost:8080/login');
});

// ==== Set views config ====
app.set('views', './public/views/ejs');
app.set('view engine', 'ejs');

// ==== Set http server ====
app.all('*', (req, res) => {
    return res.status(404).json(`The route "${req.path}" does not exist`);
});

const server = httpServer.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

server.on('error', err => { console.log(`Server error: ${err.message}`) });

// ==== Set socket server ====
io.on('connection', socket => {
    console.log(`New client connected ${socket.id}`);

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
        console.log(`Client disconnected: ${socket.id}`);
    });
});
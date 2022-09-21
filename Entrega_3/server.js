'use strict';

const express = require('express');
const { Server: HttpServer } = require('http');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const productsRouter = require('./router/productosRouter');
const cartRouter = require('./router/carritosRouter');
const userRouter = require('./router/userRouter');

const app = express();
const httpServer = new HttpServer(app);

const dotenv = require('dotenv');
dotenv.config();

const { consoleLogger, errorLogger } = require('./utils/log4jsConfig');

const PORT = process.env.PORT || 8080;
const uri = process.env.MONGO_URL;

const MongoStore = require('connect-mongo');
const session = require('express-session');
const validateSession = require('./utils/sessionValidator');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/static', express.static(__dirname + '/public'));

app.use(session({
    store: MongoStore.create({
        mongoUrl: uri,
        ttl: 3600
    }),
    secret: 'qwerty',
    resave: true,
    saveUninitialized: true
}));

// Routers
app.use('/api/productos', productsRouter);
app.use('/api/carrito', cartRouter);
app.use('/users', userRouter);

app.all('*', validateSession, (req, res) => {
    return res.status(404).json(`The route "${req.path}" does not exist`);
});

if ((process.env.CLUSTERING === 'true') && cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    };

    cluster.on('exit', (worker, code, signal) => {
        consoleLogger.info(`Worker ${worker.process.pid} ended`);
    });

    cluster.on('listening', (worker, address) => {
        consoleLogger.info(`Worker ${worker.process.pid} listening on port ${address.port}`)
    });
} else {
    const server = httpServer.listen(PORT, () => {
        consoleLogger.info(`Master ${process.pid} server listening on port ${PORT}`);
    });

    server.on('error', error => {
        errorLogger.error(`It was an error on server. ${error.message}`);
    });
};
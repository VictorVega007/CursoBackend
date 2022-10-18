'use strict';

import express from 'express';
import session from 'express-session';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoStore from 'connect-mongo';
import compression from 'compression';
import minimist from 'minimist';
import logger from './utils/loggers/Log4jsLogger.js';
import loggerMiddleware from "./middlewares/routesLogger.middleware.js";
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import { schema } from './graphql/Schema.js';
import { CartService } from './services/cart.service.js';
import { ProductService } from './services/product.service.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(loggerMiddleware);
app.use(express.static('public'));
app.use(compression());
app.set('views', './src/views');
app.set('view engine', 'hbs');

app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}))

app.use(
    session({
        store: mongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            options: {
                userNewParser: true,
                useUnifiedTopology: true,
            }
        }),
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: {maxAge: 600000} //10 min.
        
}))

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cors());

const getAllCarts = async () => {
    return CartService.getInstance().getAll();
};

const getAllProducts = async () => {
    return ProductService.getInstance().getAll();
};

const createCart = async () => {
    return CartService.getInstance().create();
};

const deleteCartById = async ({ id }) => {
    return CartService.getInstance().deleteById(id);
};

const getAllProductsFromCartById = async ({ id }) => {
    return CartService.getInstance().getAllProductsFromCart(id);
};

const saveProductToCart = async ({ id, idProd }) => {
    return CartService.getInstance().saveProductToCart(id, idProd);
};

const deleteProductFromCart = async ({ id, idProd }) => {
    return CartService.getInstance().deleteProductFromCart(id, idProd);
};

const getProductById = async ({ id }) => {
    return ProductService.getInstance().getProductById(id);
};

const createProduct = async ({ data }) => {
    return ProductService.getInstance().create(data);
};

const updateProductById = async ({ id, data }) => {
    return ProductService.getInstance().updateProductById(id, data);
};

const deleteProductById = async ({ id }) => {
    return ProductService.getInstance().deleteById(id);
};

app.use('/graphql', 
    graphqlHTTP({
        schema,
        rootValue: {
            getAllCarts,
            getAllProducts,
            createCart,
            deleteCartById,
            getAllProductsFromCartById,
            saveProductToCart,
            deleteProductFromCart,
            getProductById,
            createProduct,
            updateProductById,
            deleteProductById
        },
        graphiql: true
    })
);

app.all('*', (req, res) => {
    res.status(404).json({'error': 'ruta no existente'})
  });

const options = {
    alias: {
        'p': 'PORT'
    },
    default: {
        'PORT': 8080
    }
};

app._router.stack.forEach(function (r) {
    if (r.route && r.route.path) {
      console.log(r.route.path)
    }
  });

const { PORT } = minimist(process.argv.slice(2), options);

const server = app.listen(PORT, () => {
    logger.info(`🚀 Server started at port:${PORT}`)
    })
    
server.on('error', (err) => logger.error(err));
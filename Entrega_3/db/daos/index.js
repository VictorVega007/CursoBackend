'use strict';

const dotenv = require('dotenv');
dotenv.config();
const uri = process.env.MONGO_URL

//SCHEMAS

const cartSchema = require('../schema/cart');
const productSchema = require('../schema/products');
const userSchema = require('../schema/users');
// const uri = 'mongodb+srv://victor:victor123@cluster0.5tx05.mongodb.net/ecommerce?retryWrites=true&w=majority';

//DAOS PRODUCTS
//Instancia de los contenedores de productos para distintos archivos
const ProductsFile = require('./productos/DaoProductsFile');
const ProductsMemory = require('./productos/DaoProductsMemory');
const ProductsFirebase = require('./productos/DaoProductsFirebase');
const ProductsMongoDB = require('./productos/DaoProductsMongoDB');

//DAOS CARRITOS
//Instancia de los contenedores de carritos para distintos archivos
const DaoCartFile = require('./carritos/DaoCartFile');
const DaoCartMemory = require('./carritos/DaoCartMemory');
const DaoCartFirebase = require('./carritos/DaoCartFirebase');
const DaoCartMongoDB = require('./carritos/DaoCartMongoDB');

//DAOS USUARIOS
const DaoUsersMongoDB = require('./usuarios/DaoUsersMongoDB');

const getStorage = () => {
    const storage = process.env.DATABASE || 'archivo';

    switch(storage) {
        case 'archivo':
            return {
                products: new ProductsFile(),
                carts: new DaoCartFile(),
            };
            break;
        
        case 'memoria':
            return {
                products: new ProductsMemory(),
                carts: new DaoCartMemory(),
            };
            break;
        
        case 'firebase':
            return {
                products: new ProductsFirebase('productos'),
                carts: new DaoCartFirebase('carrito'),
            };
            break;

        case 'mongodb':
            return {
                products: new ProductsMongoDB.getInstance('productos', productSchema, uri),
                carts: new DaoCartMongoDB.getInstance('carritos', cartSchema, uri),
                users: new DaoUsersMongoDB.getInstance('usuarios', userSchema, uri)
            };
            break;

        default:
            return {
                products: new ProductsFile(),
                carts: new DaoCartFile(),
            };
            break;
    };
};

module.exports = getStorage;
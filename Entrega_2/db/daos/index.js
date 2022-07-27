'use strict';

//SCHEMAS

import cartSchema from '../schema/cart.js';
import productSchema from '../schema/products.js';
import dotenv from 'dotenv';
dotenv.config();
const uri = 'mongodb+srv://victor:victor123@cluster0.5tx05.mongodb.net/ecommerce?retryWrites=true&w=majority';

//DAOS PRODUCTS
//Instancia de los contenedores de productos para distintos archivos
import ProductsFile from './productos/DaoProductsFile.js';
import ProductsMemory from './productos/DaoProductsMemory.js';
import ProductsFirebase from './productos/DaoProductsFirebase.js';
import ProductsMongoDB from './productos/DaoProductsMongoDB.js';

//DAOS CARRITOS
//Instancia de los contenedores de carritos para distintos archivos
import DaoCartFile from './carritos/DaoCartFile.js';
import DaoCartMemory from './carritos/DaoCartMemory.js';
import DaoCartFirebase from './carritos/DaoCartFirebase.js';
import DaoCartMongoDB from './carritos/DaoCartMongoDB.js';

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
                products: new ProductsMongoDB('productos', productSchema, uri),
                carts: new DaoCartMongoDB('carritos', cartSchema, uri),
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

export default getStorage;
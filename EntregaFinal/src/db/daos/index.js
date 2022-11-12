// deno-lint-ignore-file
const dotenv = require('dotenv')
dotenv.config()
const uri = process.env.MONGO_URL

// Schemas
const productSchema = require('../schema/product.schema')
const cartSchema = require('../schema/cart.schema')
const userSchema = require('../schema/user.schema')
const chatSchema = require('../schema/chat.schema')

// DAOS
const ProductsDAOMongoDB = require('./productos/productsMongoDB.dao')
const CartsDAOMongoDB = require('./carritos/cartMongoDB.dao')
const UsersDAOMongoDB = require('./usuarios/usersMongoDB.dao')
const ChatDAOMongoDB = require('./chat/chatMongoDB.dao')

// Factory DAOS
// Se crea este método para que implementen nuevas formas de persistencia, de ser necesario.

const getStorage = () => {
    const storage = process.env.STORAGE || 'mongodb'

    switch (storage) {
        case 'mongodb':
            return {
                products: ProductsDAOMongoDB.getInstance('producto', productSchema, uri),
                carts: CartsDAOMongoDB.getInstance('carrito', cartSchema, uri),
                users: UsersDAOMongoDB.getInstance('usuarios', userSchema, uri),
                chat: ChatDAOMongoDB.getInstance('chat', chatSchema, uri)
            }
            break
    }
}

module.exports = getStorage
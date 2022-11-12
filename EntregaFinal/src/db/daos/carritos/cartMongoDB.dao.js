const containerMongoDB = require('../../containers/mongoDB.container')
const mongoose = require('mongoose')
const { normalizeCartData } = require('../../DTOs/cart.dto')

let cartDAOMongoDBInstance = null

class CartsDAOMongoDB extends containerMongoDB {
    constructor(collectionName, schema, uri) {
        super(collectionName, schema, uri)
    }

    static getInstance(collectionName, schema, uri) {
        if (!cartDAOMongoDBInstance) {
            cartDAOMongoDBInstance = new CartsDAOMongoDB(collectionName, schema, uri)
        }
        return cartDAOMongoDBInstance
    }

    async getCartByUserId(id) {
        try {
            const items = await this.collection.find({ user: id })

            if (items) {
                return normalizeCartData(items)
            }
            throw new Error(`The user ${id} does not exist`)
        } catch (error) {
            throw new Error(`Error reading the funtion 'getById'. ${error.message}`)
        }
    }

    async modifyById(id, newData) {
        try {
            await this.collection.updateOne(
                { _id: mongoose.Types.ObjectId(id) }, 
                { $push: { productos: newData } }
                )
            return { message: `The cart with id: ${id} was updated` }
        } catch (error) {
            throw new Error(`The cart with id: ${id} does not exist. ${error.message}`)
        }
    }

    async getCartByUserIdAndStatus(id, status) {
        try {
            const items = await this.collection.find({ user: id, status: status })

            if (items) {
                return normalizeCartData(items)
            }
            throw new Error(`The user with id: ${id} does not exist`)
        } catch (error) {
            throw new Error(`Error while retrieving read getById function. ${error.message}`)
        }
    }
}

module.exports = CartsDAOMongoDB
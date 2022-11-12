// const { ClientSession } = require('mongodb')
const mongoose = require('mongoose')
const { checkConnection } = require('../connectionMongoDB')
// const { dbLogger } = require('../../utils/log4js/log4js.config')

class containerMongoDB {
    constructor(collectionName, schema, uri) {
        this.collection = mongoose.model(collectionName, schema)
        this.uri = uri
        this.mongoConnect()
    }

    async mongoConnect() {
        await checkConnection(this.uri)
    }

    async save(newObject) {
        try {
            const item = await this.collection.create(newObject)
            return item
        } catch (error) {
            throw new Error(`Error creating collection. ${error}`)
        }
    }

    async getById(id) {
        try {
            const items = await this.collection.findById(id)

            if (items) {
                return items
            }
            throw new Error(`The id ${id} does not exist`)
        } catch (error) {
            throw new Error(`Error while retrieving read getById function. ${error.message}`)
        }
    }

    async getAll(cartId) {
        try {
            const items = await this.collection.find()

            if (cartId === null) {
                return items
            }
            const selectedElement = items.find(element => element._id.toString() === (cartId))

            if (selectedElement) {
                return selectedElement.productos
            }

            throw new Error(`The cart with id ${cartId} does not exist`)
        } catch (error) {
            throw new Error(error)
        }
    }

    async deleteById(general_id, prod_id) {
        if ((this.collection.modelName === 'producto') || ((this.collection.modelName === 'carrito') && (prod_id === null))) {
            try {
                const success = await this.collection.deleteOne({ _id: mongoose.Types.ObjectId(general_id) })

                if (success.modifiedCount !== 0) {
                    return { message: `Product with id ${general_id} deleted` }
                } else {
                    throw new Error('Error finding product in collection database')
                }
            } catch (error) {
                throw new Error(`Error deleting product with id: ${general_id}. ${error}`)
            }
        } else if (this.collection.modelName === 'carrito') {
            try {
                const success = await this.collection.updateMany(
                    { _id: mongoose.Types.ObjectId(general_id) },
                    { $pull: { productos: { id: Number(prod_id) } } }
                    )

                if (success.modifiedCount !== 0) {
                    return { message: `Product with id: ${prod_id} eliminated from cart with id: ${general_id}` }
                } else {
                    throw new Error(`Product with id: ${prod_id} does not found in cart`)
                }
            } catch (error) {
                throw new Error(`Error deleting cart with id: ${general_id}. ${error}`)
            }
        } else {
            throw new Error('The databse does not exist')
        }
    }
}

module.exports = containerMongoDB
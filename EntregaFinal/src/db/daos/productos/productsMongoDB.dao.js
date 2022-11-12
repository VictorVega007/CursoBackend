const containerMongoDB = require('../../containers/mongoDB.container')
const mongoose = require('mongoose')

let productsDAOMongoDBInstance = null

class ProductsDAOMongoDB extends containerMongoDB {
    constructor(collectionName, schema, uri) {
        super(collectionName, schema, uri)
    }

    static getInstance(collectionName, schema, uri) {
        if (!productsDAOMongoDBInstance) {
            productsDAOMongoDBInstance = new ProductsDAOMongoDB(collectionName, schema, uri)
        }
        return productsDAOMongoDBInstance
    }

    async modifyById(id, newData) {
        try {
            const answer = await this.collection.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(id) },
                newData
            )
            return answer
        } catch (error) {
            throw new Error(`The product with id: ${id} was not found. ${error.message}`)
        }
    }
}

module.exports = ProductsDAOMongoDB
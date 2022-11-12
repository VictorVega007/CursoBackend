const containerMongoDB = require('../../containers/mongoDB.container')
let chatDAOMongoDBInstance = null

class ChatDAOMongoDB extends containerMongoDB {
    constructor(collectionName, schema, uri) {
        super(collectionName, schema, uri)
    }

    static getInstance(collectionName, schema, uri) {
        if (!chatDAOMongoDBInstance) {
            chatDAOMongoDBInstance = new ChatDAOMongoDB(collectionName, schema, uri)
        }
        return chatDAOMongoDBInstance
    }

    async getChatByUserId(id) {
        try {
            const items = await this.collection.find({ userId: id })

            if (items) {
                return items
            }
            throw new Error(`The id: ${id} does not exist`)
        } catch (error) {
            throw new Error(`Error reading 'getById' function for chat. ${error.message}`)
        }
    }
}

module.exports = ChatDAOMongoDB
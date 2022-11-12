const containerMongoDB = require('../../containers/mongoDB.container')
const { normalizeUserData } = require('../../DTOs/user.dto')

let usersDAOMongoDBInstance = null

class UsersDAOMongoDB extends containerMongoDB {
    constructor(collectionName, schema, uri) {
        super(collectionName, schema, uri)
    }

    static getInstance(collectionName, schema, uri) {
        if (!usersDAOMongoDBInstance) {
            usersDAOMongoDBInstance = new UsersDAOMongoDB(collectionName, schema, uri)
        }
        return usersDAOMongoDBInstance
    }

    async findUser(username) {
        try {
            const user = await this.collection.findOne({ username: username.username })
            if (user) {
                return normalizeUserData(user)
            }
        } catch (error) {
            throw new Error(`Error in search of user from 'findUser' function. ${error.message}`)
        }
    }
}

module.exports = UsersDAOMongoDB
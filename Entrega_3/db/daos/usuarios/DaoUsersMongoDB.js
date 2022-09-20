'use strict';

const mongoDbContainer = require('../../containers/mongoDbContainer');
const { normalizeUserData } = require('../../DTOs/userDTO');
let usuariosDAOMongoDBInstance = null;

class DaoUsersMongoDB extends mongoDbContainer {
    constructor(collectionName, schema, uri) {
        super(collectionName, schema, uri);
    };

    static getInstance(collectionName, schema, uri) {
        if (!usuariosDAOMongoDBInstance) {
            usuariosDAOMongoDBInstance = new DaoUsersMongoDB(collectionName, schema, uri);
        };
        return usuariosDAOMongoDBInstance;
    };

    async findUser(username) {
        try {
            const user = await this.collection.findOne({ username: username.username });
            return normalizeUserData(user);
        } catch (error) {
            throw new Error(`Error finding user ${error.message}`);
        };
    };
};

module.exports = DaoUsersMongoDB;
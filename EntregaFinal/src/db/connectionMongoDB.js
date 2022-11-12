const mongoose = require('mongoose')
const { dbLogger } = require('../utils/log4js/log4js.config')
let isConnected = false

const checkConnection = async (uri) => {
    if (!isConnected) {
        try {
            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            dbLogger.info('Connected to MongoDB')
            isConnected = true
        } catch (error) {
            throw new Error(`Error connecting to MongoDB: ${error}`)
        }
    } 
    return
}

module.exports = { checkConnection }
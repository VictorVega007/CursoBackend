const { Schema } = require('mongoose')

const chatSchema = new Schema({
    message: { type: Object, require: true },
    timestamp: { type: Number, require: true },
    user: { type: String, require: true },
    userId: { type: String, require: true }
})

module.exports = chatSchema
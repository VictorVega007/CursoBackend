const express = require('express')
const { Router } = express

const chatRouter = Router()
const { getUserMessager } = require('../controllers/chat.controller')

chatRouter.get('/', getUserMessager)

module.exports = chatRouter
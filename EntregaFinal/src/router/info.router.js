const express = require('express')
const { Router } = express

const infoRouter = Router()
const { getServerInfo } = require('../controllers/info.controller')

infoRouter.get('/', getServerInfo)

module.exports = infoRouter
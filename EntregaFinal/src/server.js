const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const cluster = require('cluster')
const numCPUs = require('os').cpus().length

const productRouter = require('./router/products.router')
const cartRouter = require('./router/cart.router')
const userRouter = require('./router/user.router')
const chatRouter = require('./router/chat.router')
const infoRouter = require('./router/info.router')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const flash = require('connect-flash')
const dotenv = require('dotenv')
dotenv.config()

const { consoleLogger, errorLogger } = require('./utils/log4js/log4js.config')
const PORT = process.env.PORT || 8080
const uri = process.env.MONGO_URL

const MongoStore = require('connect-mongo')
const session = require('express-session')
const validateSession = require('./utils/sessions/session.validator')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/static', express.static(__dirname + '/public'))
app.use(flash())

app.set('views', './src/public/views/ejs')
app.set('view engine', 'ejs')

app.use(session({
    store: MongoStore.create({
        mongoUrl: uri, 
        ttl: 3600
    }),
    secret: 'qwerty',
    resave: true, 
    saveUninitialized: true
}))

// RUTAS
app.use('/api/productos', validateSession, productRouter)
app.use('/api/carrito', validateSession, cartRouter)
app.use('/users', userRouter)
app.use('/chat', validateSession, chatRouter)
app.use('/info', validateSession, infoRouter)

app.all('*', validateSession, (req, res) => {
    return res.status(404).json(`Route '${req.path}' not found`)
})

if ((process.env.CLUSTERING === 'true') && cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {
        consoleLogger.info(`WORKER ${worker.process.pid} ended`)
    })

    cluster.on('listening', (worker, address) => {
        consoleLogger.info(`WORKER ${worker.process.pid} listening on port: ${address.pid}`)
    })
} else {
    const server = httpServer.listen(PORT, () => {
        consoleLogger.info(`MASTER ${process.pid} is listening on port: ${PORT}`)
    })

    server.on('error', (error) => { errorLogger.error(`It was an error detected: ${error.message}`) })
}

const { addItem } = require('./services/chat.service')

// ==== SET SOCKET SERVER ====
io.on('connection', socket => {
    console.log(`New client connected with id: ${socket.id}`)

    socket.on('addMessage', async newMessage => {
        await addItem(newMessage)
        const messageCont = newMessage
        socket.emit('refreshMessages', messageCont)
    })

    socket.on('disconnect', reason => {
        console.log(`Client disconnected with id: ${socket.id}`)
    })
})
'use strict';

const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const { Router } = express;
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const session = require('express-session');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { createHash, validatePassword } = require('./utils/bcrypt');
const flash = require('connect-flash');

const yargs = require('yargs/yargs');
const dotenv = require('dotenv');
const { fork } = require('child_process');

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const compression = require('compression');
const log4js = require('log4js');

// ==== Set environment variables ==== 
dotenv.config();

// ==== Set server port ==== 
const args = yargs(process.argv.slice(2))
  .alias({
    port: 'p',
    balancer: 'b'
  })
  .default({
    port: 8080,
    balancer: 'FORK'
  })
  .argv

  let PORT = 8080;
  if(typeof args.port === 'number') {
    PORT = args.port;
  };

const loadBalancer = args.balancer;

// ==== Set DB ====
const uri = process.env.MONGO_URL;

// ==== Set logger config ====

log4js.configure({
    appenders: {
        consoleLogger: { type: 'console' },
        warningsFile: { type: 'file', filename: './logs/warn.log' },
        errorsFile: { type: 'file', filename: './logs/error.log'}
    }, 
    categories: {
        default: { appenders: ['consoleLogger'], level: 'info' },
        warning: { appenders: ['consoleLogger', 'warningsFile'], level: 'warn' },
        error: { appenders: ['consoleLogger', 'errorsFile'], level: 'error'}
    }
});

const consoleLogger = log4js.getLogger('default');
const warningLogger = log4js.getLogger('warning');
const errorLogger = log4js.getLogger('error');

// ==== Set cache storage ====
const MongoStore = require('connect-mongo');

// ==== Set Middleware ====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(__dirname + '/public'));

app.use(session({
    store: MongoStore.create({
        mongoUrl: uri,
        ttl: 60
    }),
    secret: 'qwerty',
    resave: true,
    saveUninitialized: true,
}));
app.use(flash());

// ==== Schemas ====
const messagesSchema = require('./db/schema/mensajes');
const productsSchema = require('./db/schema/productos');

// ==== Daos ====
const MessagesDAOMongoDB = require('./db/daos/MensajesDAOMongoDB');
const ProductsDAOMongoDB = require('./db/daos/ProductosDAOMongoDB');

// ==== Containers (CHILD) ====
const messages = new MessagesDAOMongoDB('mensaje', messagesSchema, uri);
const products = new ProductsDAOMongoDB('producto', productsSchema, uri);

const User = require('./db/models/user');
const { error } = require('console');

// ==== Passport configuration ====
app.use(passport.initialize());
app.use(passport.session());

// ==== Passport Login Local Strategy ====
passport.use('login', new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return done(null, false, { message: `User not found "${username}"` });
        };

        if (!validatePassword(user.password, password)) {
            return done(null, false, { message: 'Password is incorrect' });
        };

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// ==== Passport Register Local Strategy ====
passport.use('signup', new LocalStrategy({ 
    passReqToCallback: true,
},  async (req, username, password, done) => {
    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return done(null, false, { message: `User already exists "${username}"` });
        };

        const newUser = {
            username: username,
            password: createHash(password),
            email: req.body.email,
        };

        const createdUser = await User.create(newUser);

        return done(null, createdUser);
    } catch (error) {
        return done(error);
    } 
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// ==== Routes ====
const apiRouter = Router();
const loginRouter = Router();
const signupRouter = Router();
const logoutRouter = Router();
const infoRouter = Router();
const randomRouter = Router();

app.use('/api/productos', apiRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/logout', logoutRouter);
app.use('/info', infoRouter);
app.use('/api/random', randomRouter);

// ==== Endpoints =====

apiRouter.get('', async (req, res) => {
    consoleLogger.info(req.baseUrl, req.method);
        
    try {
        const data3 = await products.getAll();
        const messageCont = await messages.getAll();

        if (req.user) {
            const user = req.user.email;
            return res.render('home', {
                status: 1,
                user,
                data3,
                messageCont
            });
        };
        res.redirect('/login');
        } catch {
            errorLogger.error('Error');
            throw new Error();
        };
});

loginRouter.get('', (req, res) => {
    consoleLogger.info(req.baseUrl, req.method);
    return res.render('login', { message: req.flash('error') });
});

loginRouter.post('', 
    passport.authenticate('login', {
        successRedirect: '/api/productos',
        failureRedirect: '/login',
        failureFlash: true
    }), (req, res) => {consoleLogger.info(req.baseUrl, req.method)}
);

signupRouter.get('', (req, res) => {
    consoleLogger.info(req.baseUrl, req.method);
    return res.render('signup', { message: req.flash('error') });
});

signupRouter.post('', 
    passport.authenticate('signup', {
        successRedirect: '/login',
        failureRedirect: '/signup',
        failureFlash: true
}), (req, res) => {consoleLogger.info(req.baseUrl, req.method)}
);

logoutRouter.get('', (req, res) => {
    consoleLogger.info(req.baseUrl, req.method)
    
    const user = req.session.user;

    if (req.session.user && req.session.password) {
        return res.session.destroy(err => {
            if (!err) {
                return res.status(200).render('redirect', { user });
            }; 
            return res.send({ error: err });
        });
    };
    return res.status(404).redirect(`http://localhost:8080/login`);
});

infoRouter.get('', compression(), async (req, res) => {
    consoleLogger.info(req.baseUrl, req.method)

    if (req.user) {
        const processInfo = [
            {name:"consoleArg", value: process.argv},
            {name: "platformName", value: process.platform},
            {name: "nodeVersion", value: process.version},
            {name: "memoryUsage", value: process.memoryUsage().rss},
            {name: "path", value: process.execPath},
            {name: "processId", value: process.pid},
            {name: "folder", value: process.cwd()},
            {name: "systemCores", value: numCPUs}
        ];

        return res.render('info', { processInfo });
    };
    res.redirect('/login');
});

// ==== InfoRouter configurada con Console Log ====

infoRouter.get('/test', compression(), async (req, res) => {
    consoleLogger.info(req.baseUrl, req.method);
    consoleLogger.log('TESTING');

    if (req.user) {
        const processInfo = [
            {name:"consoleArg", value: process.argv},
            {name: "platformName", value: process.platform},
            {name: "nodeVersion", value: process.version},
            {name: "memoryUsage", value: process.memoryUsage().rss},
            {name: "path", value: process.execPath},
            {name: "processId", value: process.pid},
            {name: "folder", value: process.cwd()},
            {name: "systemCores", value: numCPUs}
        ];

        return res.render('info', { processInfo });
    };
    res.redirect('/login');
})

randomRouter.get('/:number?', async (req, res) => {
    consoleLogger.info(req.baseUrl, req.method);

    if (req.user) {
        const computo = fork('./computo.js', [req.params.number]);
        computo.on('message', numberArray => {
            return res.send(numberArray);
        });
    };
});

// ==== Set views  ====
app.set('view engine', 'ejs');
app.set('views', './public/views/ejs');

// ==== Set http server with clusters ====
app.all('*', (req, res) => {
    warningLogger.warn(req.url, req.method);
    return res.status(404).json(`The route "${req.path}" does not exist`);
});

if (loadBalancer === 'CLUSTER' && cluster.isMaster) {
    console.log(`Node MASTER ${process.pid} ejecutándose`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    };

    cluster.on('exit', (worker, code, signal) => {
        console.log(`WORKER ${worker.process.pid} ended`);
    });

    cluster.on('listening', (worker, address) => {
        console.log(`WORKER ${worker.process.pid} listening on ${address.port}`);
    });
} else {
    
    const server = httpServer.listen(PORT, () => {
        console.log(`Server executing address ${server.address().port} and using ${loadBalancer} as balancer of charge. Process ID ${process.pid}`);
    });

    server.on('error', err => { 
        errorLogger.error(err);
        console.log(`Server error: ${err}`)});
}

// ==== Set socket server ====
io.on('connection', socket => {
    console.log(`New client connected ${socket.id}`);

    socket.on('addProduct', async (newProduct) => {
        const newProductID = await products.save(newProduct);
        const data3 = newProduct;
        data3.id = newProductID;
        socket.emit('refreshList', data3);
        socket.broadcast.emit('refreshList', data3);
    });

    socket.on('addMessage', newMessage => {

        messages.save(newMessage);
        const messageCont = newMessage;
        socket.emit('refreshMessages', messageCont);
        socket.broadcast.emit('refreshMessages', messageCont);
    });

    socket.on('disconnect', reason => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

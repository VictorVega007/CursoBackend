'use strict';

const express = require('express');
const { Server: HttpServer, request } = require('http');
const { Server: IOServer } = require('socket.io');
const { Router } = express;
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const session = require('express-session');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { createHash, isValidPassword } = require('./utils/bycrypt');
const flash = require('connect-flash');
const PORT = 8080;

const MongoStore = require('connect-mongo');

// ==== Session Middleware ====
const validateSession = (req, res, next) => {
    if (req.session.user && req.session.password) {
        console.log(`Usuario válido. Sesión iniciada por: ${req.session.user}`);
        return next();
    };

    if (req.body.user && req.body.password) {
        req.session.user = req.body.user;
        req.session.password = req.body.password;
        console.log(`Se ha registrado el usuario ${req.session.user}`);
        return next();
    };

    console.log('No existe el usuario. Inicie sesión');

    return res.status(401).redirect('http://localhost:8080/login');
};

// ==== Set Middlewares ====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(__dirname + '/public'));

app.use(session({
    store: MongoStore.create({
        mongoUrl: '',
        ttl: 60
    }),
    secret: 'desafio12',
    resave: true,
    saveUninitialized: true,
}))

app.use(flash());

// ==== Data base =====
const uri = '';

// ==== Schemas =====
const messagesSchema = require('./db/schema/mensajes');
const productsSchema = require('./db/schema/productos');

// ==== Daos ====
const MessagesDAOMongoDB = require('./db/daos/MensajesDAOMongoDB');
const ProductsDAOMongoDB = require('./db/daos/ProductosDAOMongoDB');

// ==== Containers (CHILD) ====
const messages = new MessagesDAOMongoDB('mensaje', messagesSchema, uri);
const products = new ProductsDAOMongoDB('producto', productsSchema, uri);

const User = require('./db/models/user');

// ==== Passport configuration ====
app.use(passport.initialize());
app.use(passport.session());

// ==== Set Login ====
passport.use('login', new LocalStrategy((username, password, done) => User.findOne({ username })
    .then(user => {
        if (!user) {
            return done(null, false, { message: `User not found "${username}"` });
        };

        if (!isValidPassword(user.password, password)) {
            return done(null, false, { message: `Invalid password (${password})` });
        };

        return done(null, user);
    })
    .catch(err => { done(err); 
})));

// ==== Set Signup ====
passport.use('signup', new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
    return User.findOne({ username })
     .then(user => {
        if (user) {
            return done(null, false, { message: `User "${username}" already exists` });
        };

        const newUser = new User();
        newUser.username = username;
        newUser.password = createHash(password);
        newUser.email = req.body.email;

        return newUser.save(); 
     })
     .then(user => done(null, user))
     .catch(err => done(err));
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// ==== Set Routes ====
const apiRouter = Router();
const loginRouter = Router();
const logoutRouter = Router();
const signupRouter = Router();

app.use('/api/productos', apiRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/signup', signupRouter);

apiRouter.get('', async (req, res) => {
    const data3 = await products.getAll();
    const messageCont = await messages.getAll();

    if(req.user) {
        const user = req.user.email;
        return res.render('home', {
            status: 1, 
            data3,
            messageCont,
            user
        });
    };
    res.redirect('/login');
});

loginRouter.get('', (req, res) => {
    return res.render('login', { message: req.flash('error') });
});

loginRouter.post('', passport.authenticate('login', {
    successRedirect: '/api/productos',
    failureRedirect: '/login',
    failureFlash: true
}));

signupRouter.get('', (req, res) => {
    return res.render('signup', { message: req.flash('error') });
});

signupRouter.post('', passport.authenticate('signup', {
    successRedirect: '/login',
    failureRedirect: '/signup',
    failureFlash: true
}));

logoutRouter.get('', (req, res) => {
    const user = req.session.user;
    if (req.session.user && req.session.password) {
        return req.session.destroy(err => {
            if (!err) {
                return res.status(200).render('redirect', { user });
            };
            res.send({ error: err });
        });
    };
    return res.status(404).redirect('http://localhost:8080/login');
});

// ==== Set views config ====
app.set('views', './public/views/ejs');
app.set('view engine', 'ejs');

// ==== Set http server ====
app.all('*', (req, res) => {
    return res.status(404).json(`The route "${req.path}" does not exist`);
});

const server = httpServer.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

server.on('error', err => { console.log(`Server error: ${err.message}`) });

// ==== Set socket server ====
io.on('connection', socket => {
    console.log(`New client connected ${socket.id}`);
    usersArray.push(socket.id);

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
        usersArray = usersArray.filter(user => user != socket.id);
        console.log(`Client disconnected: ${socket.id}`);
    });
});
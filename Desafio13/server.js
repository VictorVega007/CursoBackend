'use strict';

const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const { Router } = express;
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const session = require('express-session');
const PORT = 8080;

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { createHash, validatePassword } = require('./utils/bcrypt');
const flash = require('connect-flash');

// ==== Set cache storage ====
const MongoStore = require('connect-mongo');

// ==== Set Middleware ====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(__dirname + '/public'));

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://victor:victor123@cluster0.5tx05.mongodb.net/desafio?retryWrites=true&w=majority',
        ttl: 60
    }),
    secret: 'qwerty',
    resave: true,
    saveUninitialized: true,
}));
app.use(flash());

// ==== Set DB ====
const uri = 'mongodb+srv://victor:victor123@cluster0.5tx05.mongodb.net/desafio?retryWrites=true&w=majority';

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

app.use('/api/productos', apiRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/logout', logoutRouter);

apiRouter.get('', async (req, res) => {
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
        return res.session.destroy(err => {
            if (!err) {
                return res.status(200).render('redirect', { user });
            }; 
            return res.send({ error: err });
        });
    };
    return res.status(404).redirect('http://localhost:8080/login');
});

// ==== Set views  ====
app.set('view engine', 'ejs');
app.set('views', './public/views/ejs');

// ==== Start server ====
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
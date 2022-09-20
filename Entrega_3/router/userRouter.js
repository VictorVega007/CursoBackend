'use strict';

const express = require('express');
const app = express();
const { Router } = express;
const userRouter = Router();

const {
    addUser,
    userLogin,
    loginView,
    userLogout,
    userInfo
} = require('../controllers/userController');

const getStorage = require('../db/daos');
const { users: storage } = getStorage();

const flash = require('connect-flash');
const { errorLogger } = require('../utils/log4jsConfig');

const { createHash, isValidPassword } = require('../utils/bcrypt');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const validateSession = require('../utils/sessionValidator');

// ==== EXPRESS MIDDLEWARES ====

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash());

// ==== PASSPORT MIDDLEWARES ====

// Serialize
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize
passport.deserializeUser((id, done) => {
    return storage.getById(id)
        .then(user => done(null, user))
        .catch(error => {
            errorLogger.error(error);
            done(error);
        });
});

// Signup Strategy
passport.use('signup', new LocalStrategy({
    passReqToCallback: true,
}, (req, username, password, done) => {
    return storage.findUser({ username })
        .then(user => {
            if (user) {
                throw new Error(`User ${user.username} already exists`);
            };
            req.body.password = createHash(password);
            return storage.save(req.body);
        })
        .then(user => {
            done(null, user);
        })
        .catch(error => {
            errorLogger.error(error);
            done(error);
        });
    })
);

// Login Strategy
passport.use('login', new LocalStrategy((username, password, done) => {
    return storage.findUser({ username })
        .then(user => {
            if (!user) {
                throw new Error(`The user ${username} not found`);
            };

            if (!isValidPassword(user.password, password)) {
                throw new Error(`The password ${password} is not valid`);
            };

            return done(null, user);
        })
        .catch(error => {
            errorLogger.error(error);
            done(error);
        });
    })
);

// RUTAS CRUD DE USER

// Crear nuevo usuario
userRouter.post('/create', 
    passport.authenticate('signup', {
        failureRedirect: '/users/create',
        failureFlash: true
    }),
    addUser
);

// Login usuario
userRouter.post('/login',
    passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    }),
    userLogin
);

// Login view
userRouter.get('/login', loginView);

// Logout view
userRouter.post('/logout', userLogout);

// Información usuario
userRouter.get('/info', validateSession, userInfo);

module.exports = userRouter;
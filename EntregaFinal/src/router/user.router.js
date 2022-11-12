const express = require('express')
const app = express()

const { Router } = express
const userRouter = Router()

const getStorage = require('../db/daos')
const { users: storage } = getStorage()

const flash = require('connect-flash')

const { errorLogger, warningLogger } = require('../utils/log4js/log4js.config')

const { createHash, isValidPassword } = require('../utils/bcrypt/bcrypt')
const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')
const validateSession = require('../utils/sessions/session.validator')

const { 
    addUser,
    userLogin,
    loginView,
    userLogout,
    userInfo,
    createUser,
    signupView 
} = require('../controllers/user.controller')

// ==== EXPRESS MIDDLEWARES ====

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Flash
app.use(flash())

// ==== PASSPORT MIDDLEWARES ====

// Serialize
passport.serializeUser((user, done) => {
    done(null, user._id)
})

// Deserialize
passport.deserializeUser((id, done) => {
    return storage.getById(id)
        .then(user => done(null, user))
        .catch(error => {
            errorLogger.error(error)
            done(error)
        })
})

// Signup Strategy
passport.use('signup', new LocalStrategy({ 
    passReqToCallback: true 
},
(req, username, password, done) => {
    return storage.findUser({ username })
        .then(user => {
            if (user) {
                throw new Error(`The user ${user.username} is already exists`)
            }
            req.body.password = createHash(password)
            return createUser(req.body)
        })
        .then(user => {
            done(null, user)
        })
        .catch(error => {
            errorLogger.error(error)
            done(error)
        })
}))

// Login Strategy
passport.use('login', new LocalStrategy(
    (username, password, done) => {
        return storage.findUser({ username })
            .then(user => {
                if (!user) {
                    return done(warningLogger.warn(`The user "${username}" does not found`))
                }
                if (!isValidPassword(user.password, password)) {
                    return done(warningLogger.warn('The password is not correct'))
                }
                return done(null, user)
            })
            .catch(error => {
                errorLogger.error(error)
                done(error)
            })
    }
))

// CRUD DE USUARIO

// Crear un usuario
userRouter.post('/create', 
    passport.authenticate('signup', {
        successRedirect: '/users/login',
        failureRedirect: '/users/login',
        failureFlash: true
    }),
    addUser
)

// Login usuario
userRouter.post('/login',
    passport.authenticate('login', {
        failureRedirect: '/error',
        failureFlash: true
    }),
    userLogin
)

// Login View
userRouter.get('/login', loginView)

// Signup View
userRouter.get('/create', signupView)

// Logout 
userRouter.post('/logout', userLogout)

// Info usuario
userRouter.get('/info', validateSession, userInfo)

module.exports = userRouter
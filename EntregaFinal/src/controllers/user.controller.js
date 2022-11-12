// Emailing

const { notifyNewUser } = require('../utils/notifications/ethereal')
const adminUser = {
    nombre: process.env.ADMIN_NOMBRE,
    username: process.env.ADMIN_EMAIL,
    telefono: process.env.ADMIN_TELEFONO
}

// Storage

const mongoose = require('mongoose')
const { getItemById, createItem } = require('../services/user.service')
// const { getItemByUserId } = require('../services/cart.service')

// Logger

const { errorLogger } = require('../utils/log4js/log4js.config')

// Controllers

const addUser = async (req, res) => {
    const newUser = req.body
    await notifyNewUser(newUser, adminUser)
    res.redirect('/users/login')
}

const signupView = async (req, res) => {
    return await res.status(200).render('signup')
}

const createUser = async (req, res) => {
    return await createItem(req)
}

const userLogin = async (req, res) => {
    await res.status(200).redirect('/chat')
}

const loginView = async (req, res) => {
    return await res.status(200).render('login', { message: req.flash('error') })
}

const userLogout = async (req, res) => {
    await req.session.destroy(err => {
        if (err) {
            return next(err)
        }
        res.status(100).redirect('/users/login')
    })
}

const userInfo = async (req, res) => {
    try {
        const user = await getItemById(mongoose.Types.ObjectId(req.session.passport.user))
        return res.status(200).json({
            url: req.originalUrl,
            method: req.method,
            status: 200,
            error: null,
            message: { user }
        })
    } catch (error) {
        errorLogger.error(error)
        return res.status(500).json(error.message)
    }
}

module.exports = {
    addUser,
    userLogin,
    loginView,
    userLogout,
    userInfo,
    createUser,
    signupView
}
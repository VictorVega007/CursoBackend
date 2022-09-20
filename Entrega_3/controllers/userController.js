'use strict';

// Emailing
const { notifyNewUser } = require('../utils/ethereal');
const adminUser = {
    nombre:process.env.ADMIN_NOMBRE, 
    username: process.env.ADMIN_EMAIL, 
    telefono:process.env.ADMIN_TELEFONO
};

// Storage
const mongoose = require('mongoose');
const { getItemById } = require('../services/userServices');

// Logger
const { errorLogger, warningLogger } = require('../utils/log4jsConfig');

const addUser = async (req, res) => { 
    const newUser = req.body;

    notifyNewUser(newUser, adminUser);
    res.redirect('/users/login');
};

const userLogin = async (req, res) => { 
    res.status(202).json({ message: 'Sesion iniciada con exito' });
};

const loginView = async (req, res) => {
    warningLogger.warn(`Ruta /login en construccion`);
    return res.status(200).json({message: `Aca se debe cargar la pantalla de login`});
};

const userLogout = async (req, res) => {
    req.session.destroy(err =>  {
        if (err) { 
            return next(err) 
        };
        res.status(100).redirect('/users/login');
    });
};

const userInfo = async (req, res) => {
    try{
        const mongooseTypes = mongoose.Types.ObjectId(req.session.passport.user);
        const user = await getItemById(mongooseTypes)

        return res.status(200).json({
            url: req.originalUrl, 
            method: req.method, 
            status: 200, 
            error: null, 
            message: {user}
        });
    } catch (error) {
        errorLogger.error(error);
        return res.status(500).json(error.message);
    };
};

module.exports = { 
    addUser, 
    userLogin, 
    loginView, 
    userLogout, 
    userInfo 
};
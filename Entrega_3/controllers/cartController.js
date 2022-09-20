'use strict';

const { errorLogger } = require('../utils/log4jsConfig');
const authorizationLevel = 0;

const { notifyPurchase } = require('../utils/ethereal');
const sendWhatsApp = require('../utils/twilio');

const adminUser = { 
    nombre: process.env.ADMIN_NOMBRE, 
    username: process.env.ADMIN_EMAIL,
    telefono: process.env.ADMIN_TELEFONO
 };

 const {
    getItemByUserId,
    addItem,
    deleteItem,
    getAllItems,
    editItem,
    getItemById
 } = require('../services/cartServices');

 const getUsersCart = async (req, res) => {
    if (authorizationLevel === 0 || authorizationLevel === 1) {
        try {
            const userId = req.session.passport.user;
            const data3 = await getItemByUserId(userId);
            return res.status(200).json(data3)
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json(error.message);
        };
    } else {
        return res.status(401).json({
            url: req.originalUrl,
            method: req.method,
            status: 401,
            error: 'Unauthorized',
            message: `Ruta '${req.originalUrl}', método '${req.method}' no autorizados para el usuario.`
        });
    };
 };

const createCart = async (req, res) => {
    if ((authorizationLevel === 0 || authorizationLevel === 1) && req.session.passport.user) {
        const newCart = req.body;
        newCart.user = req.session.passport.user;
        newCart.status = 'open';

        try {
            const answer = await addItem(newCart);
            return res.status(201).json(answer);
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json(error.message);
        };
    } else {
        return res.status(401).json({
            url: req.originalUrl,
            method: req.method,
            status: 401,
            error: 'Unauthorized',
            message: `Ruta '${req.originalUrl}', método '${req.method}' no aurizados para el usuario.`
        });
    };
};

const deleteCart = async (req, res) => {
    if (authorizationLevel === 0 || authorizationLevel === 1) {
        const cartId = req.params.id;
        try {
            const answer = await deleteItem(cartId, null);
            return res.status(201).json(answer);
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json(error.message);
        };
    } else {
        return res.status(401).json({
            url: req.originalUrl,
            method: req.method,
            status: 401,
            error: 'Unauthorized',
            message: `Ruta '${req.method}}', método '${req.method}' no autorizados para el usuario.`
        });
    };
};

const getProductsFromCart = async (req, res) => {
    if (authorizationLevel === 0 || authorizationLevel === 1) {
        const cartId = req.params.id;
        if (!cartId) {
            return res.status(500).json(`El carrito con el id '${cartId}' no existe`);
        };

        try {
            const data3 = await getAllItems(cartId);
            return res.status(200).json(data3);
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json(error.message);
        };
    } else {
        return res.status(401).json({
            url: req.originalUrl,
            method: req.method,
            status: 401,
            error: 'Unauthorized',
            message: `Ruta '${req.method}}', método '${req.method}' no autorizados para el usuario.`
        });
    };
};

const addProductsToCart = async (req, res) => {
    if (authorizationLevel === 0) {
        const cartId = req.params.id;
        const newProduct = req.body;

        try {
            // NOTA: Data debe ser un objeto JSON con los atributos: nombre, descripcion, codigo, precio, stock, imagen.
            const answer = await editItem(cartId, newProduct);
            return res.status(201).json(answer);
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json(error.message);
        };
    } else {
        return res.status(401).json({
            url: req.originalUrl,
            method: req.method,
            status: 401,
            error: 'Unauthorized',
            message: `Ruta '${req.method}}', método '${req.method}' no autorizados para el usuario.`
        });
    };
};

const deleteProductFromCart = async (req, res) => {
    if (authorizationLevel === 0 || authorizationLevel === 1) {
        const cartId = req.params.id;
        const productId = req.params.id_prod;

        try {
            const answer = await deleteItem(cartId, productId);
            return res.status(201).json(answer);
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json(error.message);
        };
    } else {
        return res.status(401).json({
            url: req.originalUrl,
            method: req.method,
            status: 401,
            error: 'Unauthorized',
            message: `Ruta '${req.method}}', método '${req.method}' no autorizados para el usuario.`
        });
    };
};

const finishPurchase = async (req, res) => {
    if (authorizationLevel === 0 || authorizationLevel === 1) {
        const cartId = req.body.cartId;

        try {
            const { cartProducts, cartUser } = await getItemById(cartId);
            await notifyPurchase(
                cartProducts, {
                    username: cartUser.username,
                    nombre: cartUser.nombre 
                }, 
                adminUser);
            
            await sendWhatsApp({
                username: cartUser.username,
                nombre: cartUser.nombre,
                apellido: cartUser.apellido
                }, 
                adminUser);

            return res.status(201).json('Ok');
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json(error.message);
        };
    } else {
        return res.status(401).json({
            url: req.originalUrl,
            method: req.method,
            status: 401,
            error: 'Unauthorized',
            message: `Ruta '${req.method}}', método '${req.method}' no autorizados para el usuario.`
        });
    };
};

module.exports = {
    getUsersCart,
    createCart,
    deleteCart,
    getProductsFromCart,
    addProductsToCart,
    deleteProductFromCart,
    finishPurchase
};
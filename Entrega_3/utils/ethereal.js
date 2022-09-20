'use strict';

const { createTransport } = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const MAIL = process.env.GMAIL_ACCOUNT;
const PASSWORD = process.env.GMAIL_PASSWORD;

const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: MAIL,
        password: PASSWORD
    }
});

const notifyPurchase = async (products, customer, admin) => {
    const customerMail = {
        from: `E-commerce Victor Vega | [NUEVO PEDIDO]`,
        to: customer.username,
        subject: `E-commerce Victor Vega | Gracias por su compra`,
        html: 
            `<h1> Hola ${customer.nombre}! </h1> 
            </br> 
                <p>Gracias por comprar los siguientes articulos: </p> 
            </br> 
            <ol>
                ${products}
            </ol>
            `
    };

    const adminMail = {
        from: `E-commerce | [NUEVO PEDIDO]`,
        to: admin.username,
        subject: `E-commerce | Nueva Venta`,
        html: 
            `<h1> Hola ${admin.nombre}! </h1>
            </br> 
                <p>${customer.nombre} ha realizado la siguiente compra: </p> 
            </br> 
            <ol>
                ${products}
            </ol>`
    };

    try {
        await transporter.sendMail(customerMail);
        await transporter.sendMail(adminMail);
    } catch (error) {
        console.log(error);
    };
};

const notifyNewUser = async (customer, admin) => {
    const adminMail = {
        from: `E-commerce Victor Vega | [NUEVO USUARIO]`,
        to: admin.username,
        subject: `E-commerce | Nuevo Usuario`,
        html: 
        `<h1> Hola ${admin.nombre}! </h1> 
        </br> 
            <p>Se ha registrado un nuevo usuario! </p> 
            <p>Estos son sus datos:</p>
        </br> 
        <ol>
            <li>Nombre: ${customer.nombre}</li>
            <li>Apellido: ${customer.apellido}</li>
            <li>Email: ${customer.username}</li>
            <li>Edad: ${customer.edad}</li>
            <li>Direccion: ${customer.direccion}</li>
            <li>Telefono: ${customer.telefono}</li>
            <li>URL Foto: ${customer.foto}</li>
        </ol>
        `
    };

    const customerMail = {
        from: `E-commerce Victor Vega | [REGISTRO EXITOSO]`,
        to: customer.username,
        subject: `E-commerce | Gracias por registrarse`,
        html: 
            `<h1> Hola ${customer.nombre}! </h1>
            </br> 
            <p>Gracias por registrarte en nuestro e-Commerce! </p>`
    };

    try {
        await transporter.sendMail(adminMail);
        await transporter.sendMail(customerMail);
    } catch (error) {
        console.log(error);
    };
};

module.exports = {
    notifyPurchase,
    notifyNewUser
};
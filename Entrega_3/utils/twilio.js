'use strict';

const twilio = require('twilio');
const dotenv = require('dotenv');
dotenv.config();

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const PHONE_NUMBER_WHATSAPP = process.env.TWILIO_PHONE_NUMBER_WHAT;

// const PHONE_NUMBER_WHATSAPP = 'whatsapp: +56937518479';

const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

const sendWhatsApp = async (user, admin) => {
    try {
        await client.messages.create({
            body: `Hola ${admin.nombre}! Tienes un nuevo pedido de ${user.nombre} ${user.apellido}. Puedes contactartlo en el siguiente mail: ${user.username}`,
            from: PHONE_NUMBER_WHATSAPP,
            to: `whatsapp: ${admin.telefono}`
        });
    } catch (error) {
        console.log(error);
    };
}; 

module.exports = sendWhatsApp;
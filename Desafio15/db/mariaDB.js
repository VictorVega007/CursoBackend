'use strict';
require('dotenv').config();

const optionsMariaDB = {
    client: 'mysql',
    connection: {
        host: process.env.MARIADB_HOST,
        user: process.env.MARIADB_USER,
        password: process.env.MARIADB_PASSWORD,
        database: process.env.MARIADB_DATABASE,
    }
};

module.exports = { 
    optionsMariaDB 
};
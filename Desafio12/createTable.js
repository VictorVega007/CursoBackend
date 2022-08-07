'use strict';

const { optionsMariaDB } = require('./db/mariaDB');
const { optionsSQLite3 } = require('./db/SQLite3');
const knexMaria = require('knex')(optionsMariaDB);
const knexSQLite3 = require('knex')(optionsSQLite3);

knexMaria.schema
    .createTable('productos', table => {
        table.string('title');
        table.float('price');
        table.string('thumbnail');
        table.increments('id');
    })
    .then(() => {
        console.log('Tabla productos creda!');
        return knexSQLite3.schema.createTable('chat', table => {
            table.string('mail');
            table.string('timestamp');
            table.string('message');
            table.increments('id');
        });
    })
    .then(() => {
        console.log('Tabla chat creada!');
    })
    .catch(error => {
        console.log(error.message);
    })
    .finally(() => {
        knexMaria.destroy();
        knexSQLite3.destroy();
    });
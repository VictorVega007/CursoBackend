'use strict';

import { knex } from '../../db.js';

export const createProductoTable = async () => {
    try {
        const isCreated = await knex.schema.hasTable('productos');
        if (isCreated) {
            console.log('La tabla productos ya existe en la BD');
        } else {
            await knex.schema.createTable('producto', table => {
                table.increments('id').primary().notNullable(),
                table.timestamp('timestamp').notNullable(),
                table.string('title', 100).notNullable(),
                table.float('price').notNullable(),
                table.string('description', 300),
                table.string('code').unique(),
                table.string('image', 300),
                table.integer('stock').notNullable()
            });

            console.log('La tabla de productos fue creada exitosamente');
        }
    } catch (error) {
        console.log(error);
    }
}

export const createCarritoTable = async () => {
    try {
        const isCreated = await knex.schema.hasTable('carrito');
        if (isCreated) {
            console.log('La tabla carrito ya existe en la BD');
        } else {
            await knex.schema.createTable('carrito', table => {
                table.increments('id').primary().notNullable(),
                table.timestamp('timestamp').notNullable()
        })
        console.log('La tabla de carrito fue creada exitosamente');
        }
    } catch (error) {
        console.log(error);
    }
}

export const createProductoCarritoTable = async () => {
    try {
        const isCreated = await knex.schema.hasTable('productoCarrito');
        if (isCreated) {
            console.log('La tabla producto carrito ya existe en la BD');
        } else {
            await knex.schema.createTable('productoCarrito', table => {
                table.increments('id').primary().notNullable(),
                table.integer('carritoId').unsigned().notNullable(),
                table.foreign('carritoId').references('id').inTable('carrito').onDelete('CASCADE'),
                table.integer('productoId').unsigned().notNullable(),
                table.foreign('productoId').references('id').inTable('producto').onDelete('CASCADE')
            })
            console.log('La tabla producto carrito fue creada exitosamente');
        }
    } catch (error) {
        console.log(error);
    }
}
'use strict';

import { knex } from '../../db.js';

const productos = [
    {
        timestamp: new Date().toISOString().slice(0, 20).replace('T', ' '),
        title: 'Remera',
        price: 40.89,
        description: 'Remera deportiva',
        code: 'ABC123',
        image: 'URL',
        stock: 30
    },
    {
        timestamp: new Date().toISOString().slice(0, 20).replace('T', ' '),
        title: 'Pantalón',
        price: 80.56,
        description: 'Pantalón estilo casual',
        code: 'ABC234',
        image: 'URL',
        stock: 40
    },
    {
        timestamp: new Date().toISOString().slice(0, 20).replace('T', ' '),
        title: 'Short',
        price: 35.50,
        description: 'Short deportivo para runners',
        code: 'ABC765',
        image: 'URL',
        stock: 25
    },
    {
        timestamp: new Date().toISOString().slice(0, 20).replace('T', ' '),
        title: 'Jean',
        price: 46.67,
        description: 'Jean slim fit',
        code: 'ABC876',
        image: 'URL',
        stock: 35
    }
];

const carritos = [
    {
        timestamp: new Date().toISOString().slice(0, 20).replace('T', ' ')
    },
    {
        timestamp: new Date().toISOString().slice(0, 20).replace('T', ' ')
    },
    {
        timestamp: new Date().toISOString().slice(0, 20).replace('T', ' ')
    }
];

const productoCarritoRelations = [
    {
        carritoId: 2,
        productoId: 1
    },
    {
        carritoId: 2,
        productoId: 2
    },
    {
        carritoId: 2,
        productoId: 3
    }
]

export const populateProducts = async () => {
    try {
        await knex.insert(productos).from('producto');
        console.log('Se agregaron productos a la tabla')
    } catch (error) {
        console.log(error);
    }
};

export const populateCarts = async () => {
    try {
        await knex.insert(carritos).from('carrito');
        console.log('Se agregaron carritos a la tabla');
    } catch (error) {
        console.log(error);
    }
};

export const populateProductoCarrito = async () => {
    try {
        await knex.insert(productoCarritoRelations).from('productoCarrito');
        console.log('Se agregaron relaciones a la tabla');
        return;
    } catch (error) {
        console.log(error);
    }
}
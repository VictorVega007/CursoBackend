'use strict';

import dotenv from 'dotenv';
dotenv.config()

export const config = {
    client: 'mysql',
    connection: {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
    }
}
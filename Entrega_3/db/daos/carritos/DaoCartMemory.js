'use strict';

const memoryContainer = require('../../containers/memoryContainer');

class DaoCartMemory extends memoryContainer {
    constructor() {
        super('carrito');
    };
};

module.exports = DaoCartMemory;
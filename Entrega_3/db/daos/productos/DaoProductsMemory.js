'use strict';

const memoryContainer = require('../../containers/memoryContainer');

class ProductsMemory extends memoryContainer {
    constructor() {
        super('producto');
    };
};

module.exports = ProductsMemory;
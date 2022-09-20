'use strict';

const fileContainer = require('../../containers/fileContainer');

class ProductsFile extends fileContainer {
    constructor() {
        super ('./productos.json');
    };
};

module.exports = ProductsFile;

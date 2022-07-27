'use strict';

import fileContainer from '../../containers/fileContainer.js';

class ProductsFile extends fileContainer {
    constructor() {
        super ('./productos.json');
    };
};

export default ProductsFile;

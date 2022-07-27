'use strict';

import memoryContainer from '../../containers/memoryContainer.js';

class ProductsMemory extends memoryContainer {
    constructor() {
        super('producto');
    };
};

export default ProductsMemory;
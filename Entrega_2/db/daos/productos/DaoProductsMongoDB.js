'use strict';

import mongoDbContainer from '../../containers/mongoDbContainer.js';

class ProductsMongoDB extends mongoDbContainer {
    constructor(collectionName, schema, uri) {
        super(collectionName, schema, uri);
    };
};

export default ProductsMongoDB;
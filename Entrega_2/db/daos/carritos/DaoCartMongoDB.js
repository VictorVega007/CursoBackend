'use strict';

import mongoDbContainer from '../../containers/mongoDbContainer.js';

class DaoCartMongoDB extends mongoDbContainer {
    constructor(collectionName, schema, uri) {
        super(collectionName, schema, uri);
    };
};

export default DaoCartMongoDB;
'use strict';

import firebaseContainer from '../../containers/firebase/firebaseContainer.js';

class ProductsFirebase extends firebaseContainer {
    constructor(collectionName) {
        super(collectionName);
    };

    async updateById(productUpdated, id) {
        try {
            const doc = this.query.doc(id);
            let item = await doc.update(productUpdated);
            console.log(`Product updated: ${item}`)
        } catch (error) {
            console.log(`Error updating product: ${error}`);
        };
    };
};

export default ProductsFirebase;
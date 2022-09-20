'use strict';

const FirebaseContainer = require('../../containers/firebase/firebaseContainer');

class ProductsFirebase extends FirebaseContainer {
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

module.exports = ProductsFirebase;
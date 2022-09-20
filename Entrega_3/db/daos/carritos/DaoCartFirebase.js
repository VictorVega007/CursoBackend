'use strict';

const firebaseContainer = require('../../containers/firebase/firebaseContainer');
const { FieldValue } = require('firebase-admin/firestore');

class DaoCartFirebase extends firebaseContainer {
    constructor(collectionName) {
        super(collectionName);
    };

    async deleteById (cartId, prodId) {
        try {
            const doc = this.query.doc(cartId);
            const getDoc = await this.query.doc(cartId).get();
            let item = await doc.update({
                products: getDoc.data().products.filter(products => products.id !== prodId)
            });
            console.log(`The product ${item} has been deleted`);
            return item;
        } catch (error) {
            throw new Error(`Error while deleting the product ${error}`);
        };
    };

    async updateById (id, product) {
        try {
            const doc = this.query.doc(id);
            let item = await doc.update({
                products: FieldValue.arrayUnion(product)
            });
            console.log(`The product ${item} has been added`);
            return item
            
        } catch (error) {
            console.log(`Error: ${error}`);
        };
    };
};

module.exports = DaoCartFirebase;
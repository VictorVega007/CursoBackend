'use strict';

const admin = require('firebase-admin');
const serviceAccount = require('./config');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://backend-ecommerce-342c9-default-rtdb.firebaseio.com/'
});

console.log('Connected to Firebase');

module.exports = class FirebaseContainer {
    constructor(collection) {
        this.db = admin.firestore();
        this.query = this.db.collection(collection);
    };

    async save (item) {
        try {
            const itemSaved = await this.query.add(item);
            return { ...item, id: itemSaved.id };
        } catch(error) {
            console.log(`Error saving item: ${error}`);
        };
    };

    async getAll () {
        try {
            const result = [];
            const snapshot = await this.query.get();
            snapshot.forEach(doc => {
                result.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            return result;

        } catch(error) {
            console.log(`Error getting all items: ${error}`);
        };
    };

    async getById (id) {
        try{
            const doc = await this.query.doc(id).get();
            if(!doc.exists) {
                console.log(`Item with id ${id} not found`);
            } else {
                const data = doc.data();
                return {...data, id };
            }
        } catch(error){
            console.log(`Error getting item with id ${id}: ${error}`);
        };
    };

    async deleteById (id) {
        try {
            const doc = this.query.doc(id);
            const item = await doc.delete();
            
            console.log(`Element with id ${id} deleted`, item);
        } catch(error) {
            console.log(`Error deleting item with id ${id}: ${error}`);
        };
    };
};
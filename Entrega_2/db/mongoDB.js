'use strict';

import mongoose from "mongoose";

const uri = 'mongodb+srv://victor:victor123@cluster0.5tx05.mongodb.net/ecommerce?retryWrites=true&w=majority';

const connection = mongoose.connect(uri, {
    useNewUrlParser: true,
})
.then(_=> console.log('MongoDB is connected'));

export default connection;
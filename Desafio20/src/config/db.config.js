'use strict';

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from '../utils/loggers/Log4jsLogger.js';
dotenv.config();

const uri = process.env.MONGO_URI;

mongoose.connect(uri, (err) => {
    err
        ? logger.error('⛔ Error to connect to MongoDB')
        : logger.info('🆗 Connected to MongoDB');
});

export default mongoose;

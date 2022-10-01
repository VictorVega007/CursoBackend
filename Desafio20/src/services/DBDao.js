'use strict';

import logger from '../utils/loggers/Log4jsLogger.js';
import '../config/db.config.js';

export class DBDao {
    constructor() {
        this.logger =logger;
        if (this.constructor === DBDao) {
            throw new Error(`Class "DBDao" can not be instantiated`);
        };
    };

    create() {
        throw new Error(`Create method must be implemented`);
    };

    getAll() {
        throw new Error(`Get all methods must be implemented`);
    };

    deleteById() {
        throw new Error(`DeleteById method must be implemented`);
    };
};
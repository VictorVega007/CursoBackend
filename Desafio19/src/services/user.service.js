'use strict';

import '../config/db.config.js';
import { UsersModel } from '../models/users.model.js';
import logger from '../utils/loggers/Log4jsLogger.js';

export class UserService {
    ID_FIELD = '_id';
    USERNAME_FIELD = 'username';
    
    async createUser(object) {
        try {
            return await UsersModel.create(object);
        } catch (error) {
            logger.error(error);
            return new Error(`The user could not be created. Error: ${error.message}`);
        };
    };
    
    async loginUser(object) {
        try {
            const user = await UsersModel.findOne({
                [this.USERNAME_FIELD] : object.username
            });
            
            if (!user) {
                logger.info(`User '${object.username}' does not exist`)
                return null;   
            }; 
            
            return await user.comparePassword(object.password);
        
        } catch (error) {
            logger.error(error);
            return new Error(`There was an error trying to login by user. Error: ${error.message}`);
        };
    };
};
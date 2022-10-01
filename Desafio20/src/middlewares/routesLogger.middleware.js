'use strict';

import logger from '../utils/loggers/Log4jsLogger.js';

const loggerMiddleware = (req, _res, next) => {
    logger.info(`[${req.method}] ${req.originalUrl}`);
    next();
};

export default loggerMiddleware;

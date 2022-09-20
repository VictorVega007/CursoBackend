'use strict';

const BCrypt = require('bcrypt');

const createHash = password => {
    return BCrypt.hashSync(password, BCrypt.genSaltSync(10), null);
};

const isValidPassword = (userPassword, password) => {
    return BCrypt.compareSync(password, userPassword);
};

module.exports = {
    createHash,
    isValidPassword,
};
'use strict';

const bCrybt = require('bcrypt');

const createHash = password => {
    return bCrybt.hashSync(password, bCrybt.genSaltSync(10), null);
};

const isValidPassword = (userPasword, password) => {
    return bCrybt.compareSync(password, userPasword);
};

module.exports = { createHash, isValidPassword };
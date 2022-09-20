'use strict';

const fileContainer = require('../../containers/fileContainer');

class DaoCartFile extends fileContainer {
    constructor() {
        super('./carritos.json');
    };
};

module.exports = DaoCartFile;
'use strict';

import fileContainer from '../../containers/fileContainer.js';

class DaoCartFile extends fileContainer {
    constructor() {
        super('./carritos.json');
    };
};

export default DaoCartFile;
'use strict';

import { createProductoTable, createCarritoTable, createProductoCarritoTable } from './CreateTables.js';
import { populateCarts, populateProductoCarrito, populateProducts } from './Populate.js';

const rebuild = async () => {
    await createProductoTable();
    await createCarritoTable();
    await createProductoCarritoTable();
    
    await populateProducts();
    await populateCarts();
    
    await populateProductoCarrito();
    
}

rebuild();
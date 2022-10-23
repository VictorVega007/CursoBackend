'use strict';

import { ProductService } from '../../services/product.service.js';

export const GetAllProductsQuery = `
    getAllProducts: [Product]
`;

export const getAllProducts = async () => {
    return ProductService.getInstance().getAll();
};
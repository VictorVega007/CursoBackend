'use strict';

import { ProductService } from '../../services/product.service.js';

export const GetProductByIdQuery = `
    getProductById(id: ID!): Product
`;

export const getProductById = async ({ id }) => {
    return ProductService.getInstance().getProductById(id);
};
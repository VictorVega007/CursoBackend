'use strict';

import { ProductService } from '../../services/product.service.js';

export const DeleteProductByIdMutation = `
    deleteProductById(id: ID!): Product
`;

export const deleteProductById = async ({ id }) => {
    return ProductService.getInstance().deleteById(id);
};
'use strict';

import { ProductService } from '../../services/product.service.js';

export const UpdateProductByIdMutation = `
    updateProductById(id: ID!, data: UpdateProductInput): Boolean
`;

export const updateProductById = async ({ id, data }) => {
    return ProductService.getInstance().updateProductById(id, data);
};
'use strict';

import { ProductService } from '../../services/product.service.js';

export const CreateProductMutation = `
    createProduct(data: NewProductInput): Product
`;

export const createProduct = async ({ data }) => {
    return ProductService.getInstance().create(data);
};
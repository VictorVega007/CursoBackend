'use strict';

import { CartService } from '../../services/cart.service.js';

export const GetAllProductsFromCartByIdQuery = `
    getAllProductsFromCartById(id: ID!): [Product]
`;

export const getAllProductsFromCartById = async ({ id }) => {
    return CartService.getInstance().getAllProductsFromCart(id);
};
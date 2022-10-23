'use strict';

import { CartService } from '../../services/cart.service.js';

export const SaveProductToCartMutation = `
    saveProductToCart(id: ID!, idProd: ID!): Boolean
`;

export const saveProductToCart = async ({ id, idProd }) => {
    return CartService.getInstance().saveProductToCart(id, idProd);
};
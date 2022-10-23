'use strict';

import { CartService } from '../../services/cart.service.js';

export const DeleteProductFromCartMutation = `
    deleteProductFromCart(id: ID!, idProd: ID!): Boolean
`;

export const deleteProductFromCart = async ({ id, idProd }) => {
    return CartService.getInstance().deleteProductFromCart(id, idProd);
};
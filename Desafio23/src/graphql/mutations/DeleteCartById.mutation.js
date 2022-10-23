'use strict';

import { CartService } from '../../services/cart.service.js';

export const DeleteCartByIdMutation = `
    deleteCartById(id: ID!): Cart
`;

export const deleteCartById = async ({ id }) => {
    return CartService.getInstance().deleteById(id);
};
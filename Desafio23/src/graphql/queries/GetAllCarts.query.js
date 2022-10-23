'use strict';

import { CartService } from '../../services/cart.service.js';

export const GetAllCartsQuery = `
    getAllCarts: [Cart]
`;

export const getAllCarts = async () => {
    return CartService.getInstance().getAll();
};
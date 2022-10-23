'use strict';

import { CartService } from '../../services/cart.service.js';

export const CreateCartMutation = `
    createCart: Cart
`;

export const createCart = async () => {
    return CartService.getInstance().create();
};
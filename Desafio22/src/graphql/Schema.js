'use strict';

import { buildSchema } from 'graphql';
import { ProductType } from './types/Product.type.js';
import { CartType } from './types/Cart.type.js';
import { GetAllCartsQuery } from './queries/GetAllCarts.query.js';
import { GetAllProductsQuery } from './queries/GetAllProducts.query.js';
import { CreateCartMutation } from './mutations/CartCreate.mutation.js';
import { DeleteCartByIdMutation } from './mutations/DeleteCartById.mutation.js';
import { GetAllProductsFromCartByIdQuery } from './queries/GetAllProductsFromCartById.query.js';
import { SaveProductToCartMutation } from './mutations/SaveProductToCart.mutation.js';
import { DeleteProductFromCartMutation } from './mutations/DeleteProductFromCart.mutation.js';
import { GetProductByIdQuery } from './queries/GetProductById.query.js';
import { NewProductInput } from './inputs/NewProduct.input.js';
import { CreateProductMutation } from './mutations/ProductCreate.mutation.js';
import { UpdateProductInput } from './inputs/UpdateProduct.input.js';
import { UpdateProductByIdMutation } from './mutations/UpdateProductById.mutation.js';
import { DeleteProductByIdMutation } from './mutations/DeleteProductById.mutation.js';

export const schema = buildSchema (`
    ${ProductType}
    ${NewProductInput}
    ${CartType}
    ${UpdateProductInput}

    type Query {
        ${GetAllCartsQuery}
        ${GetProductByIdQuery}
        ${GetAllProductsQuery}
        ${GetAllProductsFromCartByIdQuery}
    }

    type Mutation {
        ${DeleteCartByIdMutation}
        ${CreateCartMutation}
        ${SaveProductToCartMutation}
        ${DeleteProductFromCartMutation}
        ${CreateProductMutation}
        ${UpdateProductByIdMutation}
        ${DeleteProductByIdMutation}
    }
`);
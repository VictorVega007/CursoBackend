'use strict';

import { buildSchema } from 'graphql';
import { ProductType } from './types/Product.type.js';
import { CartType } from './types/Cart.type.js';
import { NewProductInput } from './inputs/NewProduct.input.js';
import { UpdateProductInput } from './inputs/UpdateProduct.input.js';

// Queries and Mutations
import { GetAllCartsQuery, getAllCarts } from './queries/GetAllCarts.query.js';
import { GetAllProductsQuery, getAllProducts } from './queries/GetAllProducts.query.js';
import { CreateCartMutation, createCart } from './mutations/CartCreate.mutation.js';
import { DeleteCartByIdMutation, deleteCartById } from './mutations/DeleteCartById.mutation.js';
import { GetAllProductsFromCartByIdQuery, getAllProductsFromCartById } from './queries/GetAllProductsFromCartById.query.js';
import { SaveProductToCartMutation, saveProductToCart } from './mutations/SaveProductToCart.mutation.js';
import { DeleteProductFromCartMutation, deleteProductFromCart } from './mutations/DeleteProductFromCart.mutation.js';
import { GetProductByIdQuery, getProductById } from './queries/GetProductById.query.js';
import { CreateProductMutation, createProduct } from './mutations/ProductCreate.mutation.js';
import { UpdateProductByIdMutation, updateProductById } from './mutations/UpdateProductById.mutation.js';
import { DeleteProductByIdMutation, deleteProductById } from './mutations/DeleteProductById.mutation.js';

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

export const queriesAndMutations = {
    getAllCarts,
    getAllProducts,
    createCart,
    deleteCartById,
    getAllProductsFromCartById,
    saveProductToCart,
    deleteProductFromCart,
    getProductById,
    createProduct,
    updateProductById,
    deleteProductById
};
'use strict';

export const ProductType = `
    type Product {
        id: ID!
        timestamp: String
        title: String
        price: Int
        description: String
        code: String
        image: String
        stock: Int
    }
`;
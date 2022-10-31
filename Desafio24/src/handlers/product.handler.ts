import { Context, helpers } from "../deps.ts";
import { Product } from "../types/product.type.ts";
import { products } from "../configs/db.config.ts";
import { Bson } from "../deps.ts";

export const getProducts = async (ctx: Context) => {
    const allProducts = await products.find({}).toArray();
    if (allProducts) {
        ctx.response.body = allProducts;
        ctx.response.status = 200;
    }
};

export const getProduct = async (ctx: Context) => {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const product = await products.findOne({ _id: new Bson.ObjectId(id) });

    if (product) {
        ctx.response.body = product;
        ctx.response.status = 200;
    }
    ctx.response.status = 400;
};

export const createProduct = async (ctx: Context) => {
    const product: Product = await ctx.request.body().value;
    product._id = new Bson.ObjectId();
    product.date = new Date();
    await products.insertOne(product);
    
    ctx.response.body = product;
    ctx.response.status = 201;
};

export const updateProduct = async (ctx: Context) => {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const product: Product = await ctx.request.body().value;

    try {
        const updateProduct = await products.updateOne({ _id: new Bson.ObjectId(id) }, { $set: { ...product } }, { upsert: true });
        ctx.response.body = updateProduct;
        ctx.response.status = 200;
    } catch (error) {
        console.log(error);
    }
};

export const deleteProduct = async (ctx: Context) => {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    try {
        await products.deleteOne({ _id: id });
        ctx.response.status = 202;
    } catch (error) {
        console.log(error);
    }
};
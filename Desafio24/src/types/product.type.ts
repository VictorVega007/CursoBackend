import { ObjectId } from "../deps.ts";

export interface Product {
    _id: ObjectId,
    date: Date,
    title: string,
    price: number,
    description: string,
    code: string,
    image: string,
    stock: number
}
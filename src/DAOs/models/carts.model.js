import mongoose from "mongoose";

import { Schema } from "mongoose";

const collection = 'carts'

const cartSchema = new mongoose.Schema({
    products: [{
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
    }],
});

export const cartModel = mongoose.model(collection, cartSchema)
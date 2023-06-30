import mongoose from "mongoose";

const { Schema } = mongoose;

import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    code: { type: String, required: true, unique: true },
    thumbnails: { type: Array, required: true },
    stock: { type: Number, required: true },
});

productSchema.plugin(mongoosePaginate);

export default productSchema;
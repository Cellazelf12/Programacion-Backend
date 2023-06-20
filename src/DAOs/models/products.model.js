import mongoose from "mongoose";

const { Schema } = mongoose;

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

export default productSchema;
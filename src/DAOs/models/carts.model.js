import mongoose from "mongoose";

const { Schema } = mongoose;

const cartSchema = new Schema({
    id: { type: Number, required: true },
    products: [{ id: Number, quantity: Number }]
});

export default cartSchema;
import productSchema from "../../models/products.model.js";
import mongoose from 'mongoose';

class ProductManager {
    constructor() {
        const MONGODB_URI = "mongodb+srv://luchocella109:UX1ZuKXg9lkjvBGJ@ecommerce.peyqfli.mongodb.net/?retryWrites=true&w=majority";
        mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        this.products = mongoose.model('products', productSchema);
    }

    async addProduct(product) {
        const paramProduct = { id: await this.generateId(), ...product }
        const newProduct = new this.products(paramProduct);
        await newProduct.save();
        return newProduct.toObject();
    }

    async getProductByCode(code) {
        const product = await this.products.findOne({ code }).exec();
        if (!product) {
            throw new Error('Product not found');
        }
        return product.toObject();
    }

    async getProductById(id) {
        const product = await this.products.findOne({ id }).exec();
        if (!product) {
            throw new Error('Product not found');
        }
        return product.toObject();
    }

    async getProducts() {
        const products = await this.products.find().exec();
        return products.map(product => product.toObject());
    }

    async getProductsInStock() {
        const products = await this.products.find({ stock: { $gt: 0 } }).exec();
        return products.map(product => product.toObject());
    }

    async deleteProduct(id) {
        const result = await this.products.deleteOne({ id: id }).exec();
        if (result.deletedCount === 0) {
            throw new Error('Product not found');
        }
    }

    async generateId() {
        const products = await this.getProducts();
        if (products.length === 0) {
            return 0;
        }
        const lastProduct = products[products.length - 1];
        return lastProduct.id + 1;
    }

    async updateProduct(id, toUpdate) {
        const product = await this.products.findOneAndUpdate(
            { id: id },
            toUpdate,
            { new: true },
        ).exec();
        if (!product) {
            throw new Error('Product not found');
        }
        return product.toObject();
    }
}

export default ProductManager;
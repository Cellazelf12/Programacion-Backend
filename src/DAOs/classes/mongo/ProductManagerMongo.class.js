import { productsModel } from "../../models/products.model.js";
import mongoose from 'mongoose';

class ProductManager {
    constructor() {
        const MONGODB_URI = process.env.APPLICATION_MONGODB_URI;
        mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });

        this.products = mongoose.model('products', productsModel);
    }

    async addProduct(product) {
        const newProduct = new this.products(product);
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
        const product = await this.products.findById(id).exec();
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
        const result = await this.products.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new Error('Product not found');
        }
    }

    async updateProduct(id, toUpdate) {
        const product = await this.products.findByIdAndUpdate(
            id,
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
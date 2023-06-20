import { cartModel } from "../../models/carts.model.js";
import mongoose from 'mongoose';

class CartManager {
    constructor() {
        const MONGODB_URI = process.env.APPLICATION_MONGODB_URI;

        mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });

        this.Cart = mongoose.model("carts", cartModel);
    }

    async createCart() {
        const newCart = new this.Cart({ products: [] });
        await newCart.save();
        return newCart.toObject();
    }

    async addProduct(cartId, productId) {
        const product = await pM.getProductById(productId);
        if (!product) {
            throw new Error(`Product with id ${productId} not found`);
        }

        const cart = await this.Cart.findById(cartId).populate('products.id').exec();
        if (!cart) {
            throw new Error(`Cart with id ${cartId} not found`);
        }

        const productInCart = cart.products.find(p => p.id._id.equals(productId));
        if (!productInCart) {
            cart.products.push({ id: productId, quantity: 1 });
        } else {
            productInCart.quantity++;
        }

        await cart.save();
        return cart.toObject();
    }

    async getCartById(cartId) {
        const cart = await this.Cart.findById(cartId).populate('products.id').exec();
        if (!cart) {
            throw new Error(`Cart with id ${cartId} not found`);
        }
        return cart.toObject();
    }

    async getCarts() {
        const carts = await this.Cart.find().populate('products.id').exec();
        return carts.map(cart => cart.toObject());
    }

    async deleteProductFromCart(cartId, productId) {
        const cart = await this.Cart.findById(cartId).populate('products.id').exec();
        if (!cart) {
            throw new Error(`Cart with id ${cartId} not found`);
        }

        const productInCart = cart.products.find(p => p.id._id.equals(productId));
        if (!productInCart) {
            throw new Error(`Product with id ${productId} not found in cart with id ${cartId}`);
        }

        if (productInCart.quantity === 1) {
            cart.products.pull(productInCart);
        } else {
            productInCart.quantity--;
        }

        await cart.save();
        return cart.toObject();
    }
}

export default CartManager;
import cartSchema from "../../models/carts.model.js";
import mongoose from 'mongoose';

class CartManager {
    constructor() {
        mongoose.connect("mongodb+srv://luchocella109:UX1ZuKXg9lkjvBGJ@ecommerce.peyqfli.mongodb.net/?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.carts = mongoose.model('carts', cartSchema);
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = new this.carts({ id: await this.generateId(), products: [] });
        carts.push(newCart);
        await newCart.save();
        return carts;
    }

    async addProduct(cartId, productId) {
        const product = await pM.getProductById(productId);

        if (!product) { return; }

        const cart = await this.getCartById(cartId);

        const existingProduct = cart.products.find((product) => {
            return product.id == productId;
        });

        if (!existingProduct) {
            cart.products.push({ id: productId, quantity: 1 });
        } else {
            existingProduct.quantity++;
        }

        await cart.save();
        return cart;
    }

    async getCartById(cartId) {
        const cart = await this.carts.findOne({ id: cartId });

        if (!cart) {
            throw new Error('Cart not found');
        }

        return cart;
    }

    async getCarts() {
        const carts = await this.carts.find().exec();
        return carts;
    }

    async generateId() {
        const carts = await this.getCarts();
        if (carts.length === 0) {
            return 0;
        }
        const lastCart = carts[carts.length - 1];
        return lastCart.id + 1;
    }

    async deleteProductFromCart(cartId, productId) {
        const cart = await this.getCartById(cartId);
        const index = cart.products.findIndex(product => product.id === productId);

        if (index !== -1) {
            cart.products.splice(index, 1);
            await cart.save();
        } else {
            throw new Error('Product not found');
        }

        return cart;
    }
}

export default CartManager;
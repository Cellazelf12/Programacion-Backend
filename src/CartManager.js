import { existsSync, promises } from 'fs';
import __dirname from './utils.js';
import { pM } from './Server.js';

class CartManager {
    constructor(path) {
        if (!path || path === "") {
            throw new Error(
                'Debe ingresar una ruta válida para leer el archivo'
            );
        }
        if (!existsSync(path)) {
            throw new Error(`No existe el archivo en el path: ${path}`);
        }
        this.path = path;
        this.carts = [];
        this.loadCarts();
    }

    async getFile() {
        try {
            const data = await promises.readFile(this.path, "utf-8");
            const carts = JSON.parse(data);
            return carts;
        } catch (error) {
            console.error('Error while reading carts', error);
        }
    };

    async createCart() {
        const carts = await this.getFile();

        carts.push({ id: this.generateId(), products: [] });

        return await promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    }

    async addProduct(cartId, productId) {
        const product = pM.getProductById(productId);

        if (!product) { return; }

        const cart = await this.getCartById(cartId);

        try {
            const index = cart.products.findIndex((product) => {
                return product.id == productId;
            });

            if (index == -1) {
                cart.products.push({ id: productId, quantity: 1 });
            } else {
                cart.products[index].quantity++;
            }

            const carts = await this.getFile()

            const cartIndex = carts.findIndex((cartIterator) => {
                return cartIterator.id == cart.id
            })

            carts[cartIndex] = cart

            await promises.writeFile(this.path, JSON.stringify(carts, null, "\t"))
        } catch (error) {
            throw new Error("Error while adding product to cart.", error);
        }
    }

    async getCartById(cartId) {
        const carts = await this.getFile();

        const cart = carts.find((cart) => {
            return cart.id == cartId;
        });

        if (!cart) {
            throw new Error('Cart not found');
        }

        return cart;
    }

    async getCarts() {
        const carts = await this.getFile();

        return carts;
    }

    async loadCarts() {
        try {
            const data = await promises.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            console.error('Error while loading carts:', error);
        }
    }

    generateId() {
        if (this.carts.length === 0) {
            return 0;
        }
        const lastCart = this.carts[this.carts.length - 1];
        return lastCart.id + 1;
    }

    async deleteProductFromCart(cartId, productId) {
        const cart = await this.getCartById(cartId);
        const index = cart.products.findIndex(product => product.id === productId);

        if (index !== -1) {
            cart.products.splice(index, 1);

            const carts = await this.getFile()

            const cartIndex = carts.findIndex((cartIterator) => {
                return cartIterator.id == cart.id
            })

            carts[cartIndex] = cart

            await promises.writeFile(this.path, JSON.stringify(carts, null, "\t"))
        } else {
            throw new Error('Product not found');
        }
    }
}

export default CartManager;
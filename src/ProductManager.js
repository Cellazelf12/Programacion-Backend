const fs = require('fs');

function checkForDuplicates(product, products) {
    if (products.some(p => p.code === product.code)) {
        throw new Error('Product with same code already exists');
    }

    if (product.id && products.some(p => p.id === product.id)) {
        throw new Error('Product with same id already exists');
    }
}

function validateProduct(product) {
    const requiredFields = ['title', 'price', 'code', 'thumbnail', 'stock'];

    if (requiredFields.some(field => !Object.keys(product).includes(field))) {
        throw new Error('All fields are required');
    }

    if (typeof product.price !== 'number' || product.price <= 0) {
        throw new Error('Price must be a positive number');
    }

    if (typeof product.stock !== 'number' || product.stock < 0) {
        throw new Error('Stock must be a positive number or zero');
    }
}

class ProductManager {
    constructor(path) {
        if (!path || path === "") {
            throw new Error(
                'Debe ingresar una ruta válida para leer el archivo'
            );
        }
        if (!fs.existsSync(path)) {
            throw new Error(`No existe el archivo en el path: ${path}`);
        }
        this.path = path;
        this.products = [];
        this.loadProducts();
    }

    async getFile() {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const products = JSON.parse(data);
            return products;
        } catch (error) {
            console.error('Error while reading products', error);
        }
    };

    async addProduct(product) {
        validateProduct(product);

        checkForDuplicates(product, this.products);

        const newProduct = {
            id: this.generateId(),
            ...product
        };

        this.products.push(newProduct);
        try {
            await this.saveProducts();
        } catch (error) {
            throw new Error('Error while saving product');
        }
        return newProduct;
    }

    getProductByCode(code) {
        const product = this.products.find(product => product.code === code);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    getProductById(id) {
        const product = this.products.find((product) => product.id === id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async getProducts() {
        const products = await this.getFile();

        return products;
    }

    async loadProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error('Error while loading products:', error);
        }
    }

    generateId() {
        if (this.products.length === 0) {
            return 0;
        }
        const lastProduct = this.products[this.products.length - 1];
        return lastProduct.id + 1;
    }

    async deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);

        if (index !== -1) {
            this.products.splice(index, 1);
            try {
                await this.saveProducts();
            } catch (error) {
                throw new Error('Error while saving product');
            }
        } else {
            throw new Error('Product not found');
        }
    }

    async updateProduct(id, toUpdate) {
        const product = this.getProductById(id);

        Object.assign(product, toUpdate);
        try {
            await this.saveProducts();
        } catch (error) {
            throw new Error('Error while saving product');
        }

        return product;
    }

    async saveProducts() {
        try {
            const data = JSON.stringify(this.products, null, 2);
            await fs.promises.writeFile(this.path, data, 'utf8');
        } catch (error) {
            console.error('Error while saving products:', error);
            throw new Error('Error while saving products');
        }
    }
}

module.exports = ProductManager;

module.exports = ProductManager;
const fs = require('fs');
const express = require('express');

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

    if (!requiredFields.every(field => product[field])) {
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
                'Debe ingresar una ruta válida para leer el archivo "products.txt"'
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
            console.error('Error al leer el archivo:', error);
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
            console.error('Error al cargar los productos:', error);
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
            console.error('Error al guardar los productos:', error);
        }
    }
}

function getLimitedArray(array, count) {
    return array.slice(0, count);
}

module.exports = ProductManager;

module.exports = ProductManager;

const app = express();

const pM = new ProductManager("./products.json");

app.get('/products', (req, res) => {

    pM.getProducts()
        .then((products) => {
            const limit = parseInt(req.query.limit);

            if (limit && !Number.isInteger(limit)) {
                res.status(400).json({ error: 'El parámetro limit debe ser un numero mayor a 0 y debe ser un entero.' });
                return;
            }

            res.send((limit > 0 ? getLimitedArray(products, limit) : products));
        })
});

app.get('/products/:pid', (req, res) => {
    const id = parseInt(req.params.pid);

    let product;
    try {
        product = pM.getProductById(id);
    } catch {
        res.status(404).json({ error: `El producto con la id ${id} no existe.` });
    } finally {
        res.send(product);
    }
});


app.listen(8080, () => {
    console.log('Servidor iniciado en el puerto 8080');
});
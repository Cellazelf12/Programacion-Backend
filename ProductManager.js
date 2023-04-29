class ProductManager {
    constructor() {
        this.products = [];
        this.currentId = 1;
    }

    addProduct(product) {
        // Verifica que todos los campos requeridos estén presentes
        if (!product.title || !product.price || !product.code || !product.thumbnail || !product.stock) {
            throw new Error('Todos los campos son requeridos');
        }

        // Verifica que el código del producto no se repita
        if (this.getProductById(product.code)) {
            throw new Error('El código del producto ya existe');
        }

        // Agrega el producto al arreglo de productos
        const newProduct = {
            id: this.currentId++,
            ...product
        };
        
        this.products.push(newProduct);
        return newProduct;
    }

    getProductById(code) {
        return this.products.find(product => product.code === code || console.log("Not found"));
    }

    getProducts() {
        return this.products;
    }
}

const manager = new ProductManager();

console.log(manager.getProducts());

const product = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
};

manager.addProduct(product);

console.log(manager.getProducts());

manager.addProduct(product);
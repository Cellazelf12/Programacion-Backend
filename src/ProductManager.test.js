
/* 
    PROCESO DE TESTING

    (1) crear instancia de ProductManager
    (2) llamar a getProducts --> devuelve lo que está inicialmente en el archivo products.txt
    (3) llamar a addProduct. addProduct({title: "Auriculares",
                                        description: "Auriculares con microfono",
                                        price: 40000,
                                        thumbnail: "sin img",
                                        code: "abc123",
                                        stock: 25
                                        })
    (4) llamar a getProducts. Debe verificarse que se haya agregado el producto de (3)
    (5) llamar a getById. Verificar retorne el prodcuto buscado, cuando el producto este en el archivo. Si no esta, que muestre msg por consola o tire error
    (6) llamar a updateProduct. Por ejemplo, cambiar el price del producto con id 2 --> updateProduct(2, {price:150})
    (7) eliminar un producto. Verificar llamando a getProducts.

*/

const ProductManager = require("./ProductManager");

try {
    // creamos una instancia de la clase ProductManager
    const pM = new ProductManager("./products.json");

    pM.getProducts()
        .then((products) => {
            console.log("Product list: ", products);
            return pM.addProduct({
                title: "Auriculares",
                description: "Auriculares con microfono",
                price: 40000,
                thumbnail: "sin img",
                code: "abc123",
                stock: 25,
            });
        })
        .then((_) => {
            return pM.getProducts();
        })
        .then((products) => {
            console.log("Product list: ", products);
            return pM.getProductById(2);
        })
        .then((p) => {
            console.log("Producto con id: 2", p);
            return pM.getProductById(25);
        })
        .then((p) => {
            console.log("Producto con id: 25", p);
            return pM.updateProduct(2, { price: 123 });
        })
        .then((_) => pM.deleteProduct(2))
        .then((_) => pM.getProducts())
        .then((products) => {
            console.log("Product list: ", products);
        });
} catch (err) {
    console.log("file: test.js:62 ~ err:", err.message);
}

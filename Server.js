const express = require("express");
const ProductManager = require("./ProductManager");

const app = express();

const pM = new ProductManager("./products.json");

function getLimitedArray(array, count) {
    return array.slice(0, count);
}

app.use(express.urlencoded({ extended: true }))

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

    try {
        const product = pM.getProductById(id);

        if (product) {

            res.send(product);
        }
    } catch (err) {
        res.status(404).json({ error: `El producto con la id ${id} no existe.` });
        console.log(err);
    }
});


app.listen(8080, () => {
    console.log('Servidor iniciado en el puerto 8080');
});
const { Router } = require("express");
const ProductManager = require("../ProductManager.js");
const router = Router();

const pM = new ProductManager("src/files/products.json");

function getLimitedArray(array, count) {
    return array.slice(0, count);
}

router.get('/:pid', (req, res) => {
    const id = parseInt(req.params.pid);

    try {
        const product = pM.getProductById(id);

        if (product) {

            res.send(product);
        }
    } catch (err) {
        res.status(404).json({ err: `El producto con la id ${id} no existe.` });
        console.log(err);
    }
});

router.get('/', async (req, res) => {

    await pM.getProducts()
        .then((products) => {
            const limit = parseInt(req.query.limit);

            if (limit && !Number.isInteger(limit)) {
                res.status(400).json({ err: 'El parámetro limit debe ser un numero mayor a 0 y debe ser un entero.' });
                return;
            }

            res.send((limit > 0 ? getLimitedArray(products, limit) : products));
        })
});

router.post("/", async (req, res) => {
    const product = req.body;

    try {
        await pM.addProduct(product);
        res.status(201).send('Product created successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.put("/:pid", async (req, res) => {
    const fields = req.body;
    const id = parseInt(req.params.pid);

    try {
        await pM.updateProduct(id, fields);
        res.status(201).send('Product updated successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.delete("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);

    try {
        await pM.deleteProduct(id);

        res.status(201).send('Product deleted successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;

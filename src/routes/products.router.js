import { Router } from "express";
const router = Router();

function getLimitedArray(array, count) {
    return array.slice(0, count);
}

router.get('/:pid', (req, res) => {
    const id = parseInt(req.params.pid);

    try {
        const product = req.pM.getProductById(id);

        if (product) {

            res.send(product);
        }
    } catch (err) {
        res.status(404).json({ err: `El producto con la id ${id} no existe.` });
        console.log(err);
    }
});

router.get('/', async (req, res) => {

    await req.pM.getProducts()
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
        const newProduct = await req.pM.addProduct(product);
        req.socketServer.emit('newProduct', newProduct);
        res.status(201).send('Product created successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.put("/:pid", async (req, res) => {
    const fields = req.body;
    const id = parseInt(req.params.pid);

    try {
        const product = await req.pM.updateProduct(id, fields);
        req.socketServer.emit("updateProduct", product);
        res.status(201).send('Product updated successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.delete("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);

    try {
        await req.pM.deleteProduct(id);
        req.socketServer.emit("deleteProduct", id);
        res.status(201).send('Product deleted successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

export default router;


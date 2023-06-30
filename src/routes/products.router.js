import { Router } from "express";
const router = Router();

const baseUrl = 'http://localhost:8080/api/products';

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

    const { limit = 5, page = 1, sort = 0, filter, filterVal } = req.query;

    console.log(limit, page, sort, filter, filterVal);

    const products = await req.pM.getProducts(Number(limit), Number(page), Number(sort), filter, filterVal);

    products.prevLink = products.hasPrevPage ? `${baseUrl}?page=${products.prevPage}` : '';
    products.nextLink = products.hasNextPage ? `${baseUrl}?page=${products.nextPage}` : '';

    products.isValid = !(page <= 0 || page > products.totalPages);

    res.render('home', products);
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


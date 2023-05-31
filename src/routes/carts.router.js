import { Router } from "express";
import CartManager from "../CartManager.js";

const router = Router();
import __dirName from "../utils.js";
const cM = new CartManager(__dirName + "/files/carts.json");

function getLimitedArray(array, count) {
    return array.slice(0, count);
}

router.get('/:cid', async (req, res) => {
    const id = parseInt(req.params.cid);

    try {
        const cart = await cM.getCartById(id);

        if (cart) {
            res.send(cart);
        }
    } catch (err) {
        res.status(404).json({ err: `El cart con la id ${id} no existe.` });
        console.log(err);
    }
});

router.get('/', async (req, res) => {

    await cM.getCarts()
        .then((carts) => {
            const limit = parseInt(req.query.limit);

            if (limit && !Number.isInteger(limit)) {
                res.status(400).json({ err: 'El parámetro limit debe ser un numero mayor a 0 y debe ser un entero.' });
                return;
            }

            res.send((limit > 0 ? getLimitedArray(carts, limit) : carts));
        })
});

router.post("/", async (req, res) => {

    try {
        await cM.createCart();
        res.status(201).send('Cart created successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        await cM.addProduct(cartId, productId);
        res.status(201).send(`Product with id: ${productId} added successfully to the cart with id: ${cartId}`);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        await cM.deleteProductFromCart(cartId, productId);
        res.status(201).send(`Product with id: ${productId} removed successfully from the cart with id: ${cartId}`);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

export default router;


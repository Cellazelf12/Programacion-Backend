import { Router } from "express";
const router = Router();
import socketServer, { pM } from "../Server.js";

router.get('/', async (req, res) => {
    await pM.getProductsInStock().then((products) => {
        res.render('home', { style: "home.css", title: "Productos", products })
    });
});

router.get('/realtimeproducts', async (req, res) => {
    await pM.getProductsInStock().then(() => {
        res.render('realTimeProducts', { style: "home.css", title: "Productos" })

    });
});

export default router;
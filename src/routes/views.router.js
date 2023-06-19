import { Router } from "express";
const router = Router();

router.get('/', async (req, res) => {
    await req.pM.getProductsInStock().then((products) => {
        res.render('home', { style: "home.css", title: "Productos", products })
    });
});

router.get('/realtimeproducts', async (req, res) => {
    await req.pM.getProductsInStock().then(() => {
        res.render('realTimeProducts', { style: "home.css", title: "Productos" })

    });
});

export default router;
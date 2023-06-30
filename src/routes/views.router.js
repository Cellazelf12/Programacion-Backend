import { Router } from "express";
const router = Router();

router.get('/', async (req, res) => {

    let page = Number(req.query.page) || 1;

    let products = await req.pM.products.paginate({}, { page, limit: 5, lean: true });

    products.prevLink = products.hasPrevPage ? `http://localhost:8080/?page=${products.prevPage}` : '';
    products.nextLink = products.hasNextPage ? `http://localhost:8080/?page=${products.nextPage}` : '';
    products.isValid = true;
    res.render('home', products);

});

router.get('/realtimeproducts', async (req, res) => {
    await req.pM.getProductsInStock().then(() => {
        res.render('realTimeProducts', { style: "home.css", title: "Productos" })

    });
});

export default router;
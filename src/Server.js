const express = require("express");

const productRouter = require("./routes/products.router.js");
const cartRouter = require("./routes/carts.router.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.listen(8080, () => {
    console.log('Servidor iniciado en el puerto 8080');
});
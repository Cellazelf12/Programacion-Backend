import express, { json, urlencoded } from "express";
import { engine } from "express-handlebars";
import __dirname from "./utils.js";

import ProductManager from "./ProductManager.js";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

export const pM = new ProductManager(__dirname + "/files/products.json");

import { Server } from "socket.io";

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(json());
app.use(urlencoded({ extended: true }))

app.engine('handlebars', engine());
app.set('views', __dirname + "/views");
app.set('view engine', 'handlebars');

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);

const expressServer = app.listen(8080, () => {
    console.log('Servidor iniciado en el puerto 8080');
});

const socketServer = new Server(expressServer);

const products = await pM.getProductsInStock();

socketServer.on("connection", socket => {
    socketServer.emit('initProduct', products);
    socket.on("message", data => {
        console.log(data);
    });
});

export default socketServer;
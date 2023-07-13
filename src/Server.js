import express, { json, urlencoded } from "express";
import { engine } from "express-handlebars";
import __dirname from "./utils.js";

import ProductManager from "./DAOs/classes/mongo/ProductManagerMongo.class.js";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import routerAuth from './routes/auth.router.js';
import routerSessions from './routes/sessions.router.js';

import { Server } from "socket.io";

import MongoStore from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';
import { initializePassport } from './config/passport.config.js';

const app = express();

let pM = new ProductManager();

app.use(express.static(__dirname + '/public'));
app.use(json());
app.use(urlencoded({ extended: true }))

app.engine('handlebars', engine());
app.set('views', __dirname + "/views");
app.set('view engine', 'handlebars');
app.use(function (req, res, next) {
    req.socketServer = socketServer;
    req.pM = pM;
    next();
})

const MONGODB_URI = "mongodb+srv://luchocella109:UX1ZuKXg9lkjvBGJ@ecommerce.peyqfli.mongodb.net/?retryWrites=true&w=majority";

app.use(session({
    store: new MongoStore({
        mongoUrl: MONGODB_URI,
    }),
    secret: "mongoSecret",
    resave: true,
    saveUninitialized: false,
}))

initializePassport();

app.use(passport.initialize())
app.use(passport.session())


app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', routerAuth)
app.use('/api/sessions', routerSessions)

const expressServer = app.listen(8080, () => {
    console.log('Servidor iniciado en el puerto 8080');
});

const socketServer = new Server(expressServer);

const products = await pM.getProductsInStock();

socketServer.on("connection", async socket => {
    socketServer.emit('initProduct', products);
});

export default socketServer;
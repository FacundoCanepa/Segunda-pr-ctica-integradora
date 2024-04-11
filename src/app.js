import express from 'express';
import handlebars from 'express-handlebars';
import { __dirname } from "./utils.js"
import { Server } from 'socket.io';
import { connect } from 'mongoose';
import session from "express-session";
import MongoStore from "connect-mongo";
import morgan from 'morgan'; 
import flash from 'connect-flash'
import dotenv from 'dotenv';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewRouter from './routes/views.router.js'
import userRouter from './routes/user.router.js'
import socketProduct from './listeners/socketProducts.js';
import passport  from 'passport';
import './config/passport.config.js';



dotenv.config();

// initializations
const app = express();
const PORT = 8080;

// settings
const publicPath = `${__dirname}/public`;
app.use(express.static(publicPath));

//handlebars
app.engine("handlebars", handlebars.engine({ runtimeOptions: { allowProtoPropertiesByDefault: true } }));
app.set("views", __dirname + '/views');
app.set('view engine', "handlebars");

// middlewares
app.use(morgan('dev'));
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: "mongodb+srv://facundocanepach:vlfhpZLBo7Nk4IE3@cluster0.9qtafny.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
            ttl: 1000,
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.register = req.flash('registerFail');
    app.locals.loginFailEmail = req.flash('loginFailEmail')
    app.locals.loginFaildPassword = req.flash('loginFaildPassword')
    next();
} )


//rutas
app.use('/', viewRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use( '/api/user', userRouter)




const httpServer = app.listen(PORT, () => {
    try {
        console.log(`Listening to the port http://localhost:${PORT}`);
        connectDb();
    }
    catch (err) {
        console.log(err);
    }
});

const socketServer = new Server(httpServer);

socketProduct(socketServer);

const connectDb = async () => {
    try {
        await connect("mongodb+srv://facundocanepach:vlfhpZLBo7Nk4IE3@cluster0.9qtafny.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Base de datos conectada");
    } catch (err) {
        console.log(err);
    }
};
import express from 'express';
import mongoose from 'mongoose';
import "dotenv/config.js";
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import mongoStore from 'connect-mongo';


import pathHandler from './middlewares/pathHandler.mid.js';
import errorHandler from './middlewares/errorHandler.mid.js';
import indexRouter from './routes/indexRouter.js';
import dbConnect from './utils/dbConnect.js';


import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import { create } from 'express-handlebars';
import { Server } from 'socket.io';
import Handlebars from 'handlebars';


import config from './config.js';


import { addToCart, addOneProduct} from './public/js/utils.js';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser(process.env.SECRET_KEY));
app.use(session({ 
    secret: process.env.SECRET_KEY, resave: true, saveUninitialized: true,
    store: new mongoStore({ mongoUrl: process.env.MONGODB_URI, ttl: 60*60*24 })
}));

//routes
app.use(indexRouter);
app.use(errorHandler);
app.use(pathHandler);


/**
 * Indicamos a Express que vamos a estar utilizando Handlebars
 * como motor de plantillas, y configuramos la ruta donde debe buscarlas
 */
const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
    helpers: {
        json: (context) => {
            return JSON.stringify(context);
        },
        getPrice: function (product) {
            return product.offer !== 0 ? product.offer : product.priceList;
        }

    },
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('handlebars', hbs.engine);
app.set('views', `${config.DIRNAME}/views`);
app.set('view engine', 'handlebars');

const ready = () =>{
    console.log(`Server activo en puerto ${config.PORT}`);
    dbConnect();

}

const httpServer = app.listen(config.PORT, ready);

const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) => {
    console.log(`cliente activo id: ${socket.id}`);

    // Manejar nuevo producto
    socket.on('addProduct', async (productData) => {
            
            const newProduct = await addOneProduct(productData);

            if(newProduct){
                // Emitir a todos los clientes
                socket.emit('productAdded', newProduct);
            }else{
                socket.emit('error', {
                    message: 'Error al agregar el producto'
                });
            }
            
       
    });

    // Manejar agregar al carrito
    socket.on('addToCart', async (data) => {

        const newCart = await addToCart(data);
        if(newCart){
            socket.emit('cartUpdate', {
                message: 'Carrito actualizado',
                data: newCart 
            });
        }else{
            socket.emit('error', {
                message: 'Error al actualizar el carrito'
            });
        }
           
    });

});

export { socketServer };

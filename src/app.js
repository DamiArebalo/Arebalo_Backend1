import express from 'express';
import productRoutes from './routes/productsRoutes.js';
import config from './config.js';
import cartsRouter from './routes/cartsRouter.js';
import mongoose from 'mongoose';

import handlebars from 'express-handlebars';
import viewsRouter from './routes/viewsRouter.js';
import {Server} from 'socket.io';

import { create } from 'express-handlebars'
import { mongo } from 'mongoose';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));




/**
 * Indicamos a Express que vamos a estasr utilizando Handlebars
 * como motor de plantillas, y configuramos la ruta donde debe buscarlas
 */

const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
    helpers: {
        json: (context) => {
            return JSON.stringify(context);
        }
    }
});

app.engine('handlebars', hbs.engine);
app.set('views', `${config.DIRNAME}/views`);
app.set('view engine', 'handlebars');


app.use('/views', viewsRouter);


app.use('/api/products',productRoutes);
app.use('/static', express.static(`${config.DIRNAME}/public`));
app.use('/api/carts', cartsRouter);

const httpServer = app.listen(config.PORT, () => {

    mongoose.connect(config.MONGODB_URI);
        


    console.log(`Server activo en puerto ${config.PORT} y conectado en MongoDB`);
});

const socketServer = new Server(httpServer); 

socketServer.on('connection', (socket)=>{
 console.log(`cliente activo id: ${socket.id}`);
 socketServer.on('addProduct', (newProduct) => {
 
    socketServer.emit('productAdded', newProduct);
   
 });
});

export {socketServer};
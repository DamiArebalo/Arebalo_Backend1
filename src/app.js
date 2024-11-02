import express from 'express';
import mongoose from 'mongoose';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import { create } from 'express-handlebars';
import { Server } from 'socket.io';
import Handlebars from 'handlebars';

import productRoutes from './routes/productsRoutes.js';
import config from './config.js';
import cartsRouter from './routes/cartsRouter.js';
import viewsRouter from './routes/viewsRouter.js';

import { addToCart, addOneProduct} from './public/js/utils.js';




const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use('/views', viewsRouter);
app.use('/api/products', productRoutes);
app.use('/static', express.static(`${config.DIRNAME}/public`));
app.use('/api/carts', cartsRouter);

const httpServer = app.listen(config.PORT, () => {
    mongoose.connect(config.MONGODB_URI);
    console.log(`Server activo en puerto ${config.PORT} y conectado en MongoDB`);
});

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

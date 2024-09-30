import express from 'express';
import productRoutes from './routes/productsRoutes.js';
import config from './config.js';
import cartsRouter from './routes/cartsRouter.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.use('/api/products',productRoutes);
app.use('/static', express.static(`${config.DIRNAME}/public`));
app.use('/api/carts', cartsRouter);

app.listen(config.PORT, ()=>{
    console.log(`Server Activo en puerto ${config.PORT}`);
})

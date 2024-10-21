import { Router } from 'express';

import {midVal, midExists } from './productsRoutes.js'

import ProductModel from '../dao/models/productsModel.js';

import { socketServer } from '../app.js';
const router = Router();



router.get('/', async (req, res) => {
    const products = await ProductModel.find().lean();
    
    res.status(200).render('home', {products});
});

router.get('/realtimeproducts', async (req, res) => {
    const products =  await ProductModel.find().lean();
    res.status(200).render('realTimeProducts', {products});
});



 router.post('/realtimeproducts', midVal, midExists, async (req, res) => {
    
    const datoFormu = req.body;
    console.log(datoFormu.priceList);
    //creacion del nuevo producto
    const newProduct = await ProductModel.create({
        code: datoFormu.code,
        title: datoFormu.title,
        priceList: datoFormu.priceList,
        description: datoFormu.description,
        stock: datoFormu.stock,
        category: datoFormu.category
    });

    console.log(newProduct);
    

    socketServer.emit('newProduct', newProduct); // Emitir evento a todos los clientes conectados

    res.redirect('/views/realtimeproducts');

    res.send(console.log(`Producto ${datoFormu.title} Agregado correctamente`));
 });






export default router;

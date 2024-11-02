import { Router } from 'express';

import {midVal, midExists } from '../public/js/utils.js';

import ProductModel from '../dao/models/productsModel.js';
import ProductController from '../dao/productController.js';

import { socketServer } from '../app.js';
const router = Router();

const productController = new ProductController();

router.get('/', async (req, res) => {
    const { limit, page, sort, query} = req.query; // Agregar el parámetro sort

    const sortOrder = sort === 'desc' ? -1 : (sort === 'asc' ? 1 : null);

    const options = {
        limit: parseInt(limit) || 10, 
        page: parseInt(page) || 1,   
        sort: sortOrder !== null ? { priceList: sortOrder} : {},
        // sort: sort ? { [sort]: 1 } : {} // Ordenar por el campo proporcionado
    };
    // console.log(options);
    try {
        const searchQuery = { ...JSON.parse(query || '{}'), status: true };
        const products = await productController.getPaginated(searchQuery, options);
        // console.log(products);
        res.status(200).render('home', {products : products});
        console.log('Productos paginados y ordenados obtenidos correctamente');
    } catch (error) {
        res.status(500).send({ error: error.message, data: null });
    }
    
    
});

router.get('/realtimeproducts', async (req, res) => {
    const { limit, page, sort, query} = req.query; // Agregar el parámetro sort

    const sortOrder = sort === 'desc' ? -1 : (sort === 'asc' ? 1 : null);

    const options = {
        limit: parseInt(limit) || 10, 
        page: parseInt(page) || 1,   
        sort: sortOrder !== null ? { priceList: sortOrder } : {}
        // sort: sort ? { [sort]: 1 } : {} // Ordenar por el campo proporcionado
    };
    //  console.log(options);
    try {
        const searchQuery = { ...JSON.parse(query || '{}'), status: true };
        const products = await productController.getPaginated(searchQuery, options);

        // console.log(products);
        res.status(200).render('realtimeproducts', {products : products});
        console.log('Productos paginados y ordenados obtenidos correctamente');
    } catch (error) {
        res.status(500).send({ error: error.message, data: null });
    }
});



 router.post('/realtimeproducts', midVal, midExists, async (req, res) => {
    
    const datoFormu = req.body;
    // console.log(datoFormu.priceList);
    //creacion del nuevo producto
    const newProduct = await ProductModel.create({
        code: datoFormu.code,
        title: datoFormu.title,
        priceList: datoFormu.priceList,
        description: datoFormu.description,
        stock: datoFormu.stock,
        category: datoFormu.category
    });

    //  console.log(newProduct);
    

    socketServer.emit('newProduct', newProduct); // Emitir evento a todos los clientes conectados

    res.redirect('/views/realtimeproducts');

    res.send(console.log(`Producto ${datoFormu.title} Agregado correctamente`));
 });






export default router;

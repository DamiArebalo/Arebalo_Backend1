import { Router } from 'express';

import {midVal, midExists } from '../../public/js/utils.js';

import ProductModel from '../../data/mongo/models/productsModel.js';
import ProductController from '../../data/mongo/controllers/productController.js';
import CartController from '../../data/mongo/controllers/cartsController.js';

import newError from '../../utils/newError.js';


import { socketServer } from '../../app.js';
const router = Router();

const productController = new ProductController();
const cartController = new CartController();

router.get('/products', async (req, res) => {
    const { limit, page, sort, query} = req.query; // Agregar el parámetro sort

    const sortOrder = sort === 'desc' ? -1 : (sort === 'asc' ? 1 : null);

    const options = {
        limit: parseInt(limit) || 10, 
        page: parseInt(page) || 1,   
        sort: sortOrder !== null ? { priceList: sortOrder} : {},
        populate: 'category'
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
        newError(error.message, 500);
    }
    
    
});

router.get('/realtimeproducts', async (req, res) => {
    const { limit, page, sort, query} = req.query; // Agregar el parámetro sort

    const sortOrder = sort === 'desc' ? -1 : (sort === 'asc' ? 1 : null);

    const options = {
        limit: parseInt(limit) || 10, 
        page: parseInt(page) || 1,   
        sort: sortOrder !== null ? { priceList: sortOrder } : {},
        populate: 'category'
        // sort: sort ? { [sort]: 1 } : {} // Ordenar por el campo proporcionado
    };
    //  console.log(options);
    try {
        const searchQuery = { ...JSON.parse(query || '{}'), status: true };
        const products = await productController.getPaginated(searchQuery, options);

        console.log(products);
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

 router.get('/carts/:cid', async (req, res) => {
     const cartId = req.params.cid;
     const cart = await cartController.get({ _id: cartId });
     console.log("cart: ", cart);
     if (!cart) {
         return res.status(404).send({ error: 'Carrito no encontrado', data: null });
     }else{
         res.status(200).render('cart', {products : cart.products, total : cart.calculatedTotal, cartId : cartId});
     }
     
 });






export default router;

import { Router } from 'express';

import { products, midVal, midExists } from './productsRoutes.js'

import { socketServer } from '../app.js';
const router = Router();


// Clase Product
class Product {
    constructor(idProd, codeProd, title, priceList, description, stockInitial, category) {
        this.id = idProd;
        this.code = codeProd;
        this.title = title;
        this.priceList = priceList;
        this.description = description;
        this.offer = 0;
        this.stock = stockInitial;
        this.category = category;
        this.discount = 0;
        this.status = true;
    }
}

router.get('/', (req, res) => {
    //console.log(products)
    res.status(200).render('home', {products});
});

router.get('/realtimeproducts', (req, res) => {
   
    res.status(200).render('realTimeProducts', {products});
});



 router.post('/realtimeproducts', midVal, midExists, (req, res) => {
    const datoFormu = req.body;
     //funcion para crear id
    const maxId = Math.max(...products.map(e => +e.id));
    //creacion del nuevo producto
    const newProduct = new Product(maxId + 1, datoFormu.code, datoFormu.title, datoFormu.priceList, datoFormu.description, datoFormu.stock, datoFormu.category);
    products.push(newProduct);

    socketServer.emit('newProduct', newProduct); // Emitir evento a todos los clientes conectados

    res.redirect('/views/realtimeproducts');

    res.send(console.log(`Producto ${datoFormu.title} Agregado correctamente`));
 });






export default router;

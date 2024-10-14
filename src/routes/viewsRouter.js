import { Router } from 'express';
import { products } from './productsRoutes.js';


const router = Router();





router.get('/', (req, res) => {
    //console.log(products)
    res.status(200).render('home', {products});
});

router.get('/realtimeproducts', (req, res) => {
    //console.log(products)
    res.status(200).render('realTimeProducts', {products});
});




export default router;

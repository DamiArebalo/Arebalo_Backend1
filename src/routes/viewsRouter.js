import { Router } from 'express';

import { products } from './productsRoutes.js';

const router = Router();





/**
 * La estructura de endpoints para Handlebars respeta la misma base de los demás
 * paquetes de rutas, solo que en este caso, en lugar de enviar respuesta con un
 * send, utilizamos render, para que el motor de plantillas parsee la plantilla
 * antes que Express entregue el resultado.
 * 
 * Al realizar el render, indicamos qué plantilla nos interesa parsear y adjuntamos
 * un objeto con lo datos que deben reemplazarse.
 */
router.get('/', (req, res) => {
    res.status(200).render('index', products);
});

/**
 * Podemos generar tantos endpoints como haga falta, cada uno con su plantilla,
 * o incluso utilizar una variable para indicar la plantilla a renderizar.
 */
router.get('/register', (req, res) => {
    const data = {
    };
    
    // const template = 'register';
    // res.status(200).render(template, data);
    res.status(200).render('register', data);
});

router.get('/chat',(req,res)=>{
    const data = {

    };
    res.status(200).render('chat', data);
});


export default router;

import { Router } from "express";
import productsModel from '../dao/models/productsModel.js';
import ProductModel from "../dao/models/productsModel.js";

const router = Router();

let carts = [];

// Ruta raíz POST / para crear un nuevo carrito
router.post('/', (req, res) => {
    let maxId = Math.max(...carts.map(e => +e.id));
    if(maxId == -Infinity){
        maxId = 0
    }
    const newCart = {
        id: maxId+1,
        products: []
    };
    carts.push(newCart);
    res.status(201).send({ error: null, data: newCart });
    console.log(`Carrito con ID ${newCart.id} creado correctamente`);
});

// Ruta GET /:cid para listar los productos de un carrito específico
router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = carts.find(c => c.id === cartId);

    if (!cart) {
        return res.status(404).send({ error: 'Carrito no encontrado', data: null });
    }

    if(cart.products.length == 0){
        res.status(200).send({ error: null, data: "carrito vacio" });
    }else{
        res.status(200).send({ error: null, data: cart.products });
        console.log(`Productos del carrito con ID ${cartId} listados correctamente`);
    }


    
});

// Ruta POST /:cid/product/:pid para agregar un producto al carrito
router.post('/:cid/product/:pcode', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productCode = parseInt(req.params.pcode);
    const cart = carts.find(c => c.id === cartId);

    if (!cart) {
        return res.status(404).send({ error: 'Carrito no encontrado', data: null });
    }

    // Validar si el producto existe en el array de productos
    //const productExists = products.some(product => product.id === productId);
    const productExists= ProductModel.find({code: productCode}).lean();
    if (!productExists) {
        return res.status(404).send({ error: 'Producto no encontrado', data: null });
    }

    const productIndex = cart.products.findIndex(p => p.idProduct === productCode);

    if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
        console.log(`Producto ID:${productCode} suma 1 al carrito con ID:${cartId} total:${cart.products[productIndex].quantity}`);
    } else {
        cart.products.push({ idProduct: productCode, quantity: 1 });
        console.log(`Producto ID:${productCode} agregado al carrito ID:${cartId}`);
        
    }

    res.status(200).send({ error: null, data: cart });
    
});


export default router;
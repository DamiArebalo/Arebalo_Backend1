import { Router } from "express";
import productController from "../dao/productController.js";
import CartController from "../dao/cartsController.js";

const router = Router();

// Ruta raíz POST / para crear un nuevo carrito
router.post('/', async(req, res) => {

    const newCart = await CartController.add({products: [] });
    res.status(201).send({ error: null, data: newCart });
    console.log(`Carrito con ID ${newCart._id} creado correctamente`);
});

// Ruta GET /:cid para listar los productos de un carrito específico
router.get('/:cid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = await CartController.get({id: cartId});

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
router.post('/:cid/product/:pcode', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productCode = parseInt(req.params.pcode);
    const cart = await CartController.get({id: cartId});

    if (!cart) {
        return res.status(404).send({ error: 'Carrito no encontrado', data: null });
    }

    // Verificar si el producto ya está en el carrito
    const productIndex = cart.products.findIndex(product => product.code === productCode);
    if (productIndex !== -1) {
        // Si el producto ya está en el carrito, incrementar la cantidad
        cart.products[productIndex].quantity += 1;
        console.log(`Producto ID:${productCode} suma 1 al carrito con ID:${cartId} total:${cart.products[productIndex].quantity}`);
    } else {
        // Si el producto no está en el carrito, agregarlo con una cantidad de 1
        cart.products.push({ code: productCode, quantity: 1 });
        console.log(`Producto ID:${productCode} agregado al carrito ID:${cartId}`);
    }

    // Guardar los cambios en el carrito (esto asume que tienes un método para actualizar el carrito)
    await CartController.update(cart);

    res.status(200).send({ error: null, data: cart });
});


export default router;
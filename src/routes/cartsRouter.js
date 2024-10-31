import { Router } from "express";
import CartController from "../dao/cartsController.js";
const router = Router();

// Crear una instancia del controlador
const cartController = new CartController();

// Ruta raíz POST / para crear un nuevo carrito
router.post('/', async (req, res) => {
    const newCart = await cartController.add({ products: [] });
    res.status(201).send({ error: null, data: newCart });
    console.log(`Carrito con ID ${newCart._id} creado correctamente`);
});

// Ruta GET /:cid para listar los productos de un carrito específico
router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const cart = await cartController.get({ _id: cartId });
    if (!cart) {
        return res.status(404).send({ error: 'Carrito no encontrado', data: null });
    }
    if (cart.products.length == 0) {
        res.status(200).send({ error: null, data: "carrito vacío" });
    } else {
        res.status(200).send({ error: null, data: cart.products });
        console.log(`Productos del carrito con ID ${cartId} listados correctamente`);
    }
});

// Ruta POST /:cid/product/:pcode para agregar un producto al carrito
router.post('/:cid/product/:pcode', async (req, res) => {
    const cartId = req.params.cid;
    const productCode = req.params.pcode;
    const cart = await cartController.get({ _id: cartId });
    if (!cart) {
        return res.status(404).send({ error: 'Carrito no encontrado', data: null });
    }

    const productIndex = cart.products.findIndex(product => product.code === productCode);
    if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
        console.log(`Producto ID:${productCode} suma 1 al carrito con ID:${cartId} total:${cart.products[productIndex].quantity}`);
    } else {
        cart.products.push({ code: productCode, quantity: 1 });
        console.log(`Producto ID:${productCode} agregado al carrito ID:${cartId}`);
    }

    await cartController.update({ _id: cartId }, cart);
    res.status(200).send({ error: null, data: cart });
});

// Ruta DELETE /api/carts/:cid/products/:pid para eliminar del carrito el producto seleccionado
router.delete('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const updatedCart = await cartController.removeProduct(cartId, productId);
    if (!updatedCart) {
        return res.status(404).send({ error: 'Carrito o producto no encontrado', data: null });
    }

    res.status(200).send({ error: null, data: updatedCart });
    console.log(`Producto ID:${productId} eliminado del carrito con ID:${cartId}`);
});

// Ruta PUT /api/carts/:cid para actualizar el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body.products;

    const updatedCart = await cartController.update({ _id: cartId }, { products: updatedProducts });
    if (!updatedCart) {
        return res.status(404).send({ error: 'Carrito no encontrado', data: null });
    }

    res.status(200).send({ error: null, data: updatedCart });
    console.log(`Carrito con ID ${cartId} actualizado correctamente`);
});

// Ruta PUT /api/carts/:cid/products/:pid para actualizar SÓLO la cantidad de ejemplares del producto
router.put('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    const updatedCart = await cartController.updateProductQuantity(cartId, productId, quantity);
    if (!updatedCart) {
        return res.status(404).send({ error: 'Carrito o producto no encontrado', data: null });
    }

    res.status(200).send({ error: null, data: updatedCart });
    console.log(`Cantidad del producto ID:${productId} actualizada a ${quantity} en el carrito con ID:${cartId}`);
});

export default router;

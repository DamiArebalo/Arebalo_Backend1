import { Router } from "express";
import CartController from "../../data/mongo/controllers/cartsController.js";
const router = Router();
import ProductController from "../../data/mongo/controllers/productController.js";

const cartController = new CartController();
const productController = new ProductController();

router.post('/', async (req, res) => {
    const newCart = await cartController.add({products: []});
    res.status(201).send({ error: null, data: newCart });
});

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const cart = await cartController.get({ _id: cartId });
    if (!cart) {
        return res.status(404).send({ error: 'Carrito no encontrado', data: null });
    }
    res.status(200).send({ error: null, data: cart });
});

router.post('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const product = await productController.get({ _id: productId });
        if (!product) {
            return res.status(404).send({ error: 'Producto no encontrado', data: null });
        }

        const updatedCart = await cartController.addProduct(cartId, productId);
        if (!updatedCart) {
            return res.status(404).send({ error: 'Carrito no encontrado', data: null });
        }

        res.status(200).json({ error: null, data: updatedCart });
    } catch (error) {
        res.status(500).send({ error: error.message, data: null });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const updatedCart = await cartController.removeProduct(cartId, productId);
    if (!updatedCart) {
        return res.status(404).send({ error: 'Carrito o producto no encontrado', data: null });
    }

    res.status(200).send({ error: null, data: updatedCart });
});

router.put('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    const updatedCart = await cartController.updateProductQuantity(cartId, productId, quantity);
    if (!updatedCart) {
        return res.status(404).send({ error: 'Carrito o producto no encontrado', data: null });
    }

    res.status(200).send({ error: null, data: updatedCart });
});

router.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const updatedCart = await cartController.removeAllProducts(cartId);
    if (!updatedCart) {
        return res.status(404).send({ error: 'Carrito no encontrado', data: null });
    }

    res.status(200).send({ error: null, data: updatedCart });
});

export default router;
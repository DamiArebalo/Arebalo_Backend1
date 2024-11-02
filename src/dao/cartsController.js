import CartModel from './models/cartsModel.js';
import config from '../config.js';

class CartController {
    constructor() {}

    get = async (filter = {}) => {
        try {
            return await CartModel.findOne(filter).populate('products.product');
        } catch (err) {
            return err.message;
        }
    }

    add = async (data) => {
        try {
            return await CartModel.create(data);
        } catch (err) {
            return err.message;
        }
    }

    update = async (filter, updated, options = { new: true }) => {
        try {
            return await CartModel.findOneAndUpdate(filter, updated, options);
        } catch (err) {
            return err.message;
        }
    }

    delete = async (filter) => {
        try {
            return await CartModel.findOneAndDelete(filter);
        } catch (err) {
            return err.message;
        }
    }

    addProduct = async (cartId, productId) => {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return null;

            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

            if (productIndex > -1) {
                // Si el producto ya está en el carrito, incrementa la cantidad
                cart.products[productIndex].quantity += 1;
            } else {
                // Si el producto no está en el carrito, agrégalo
                cart.products.push({ product: productId, quantity: 1 });
            }

            await cart.save();
            return cart.populate('products.product');
        } catch (err) {
            return err.message;
        }
    }

    removeProduct = async (cartId, productId) => {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return null;

            cart.products = cart.products.filter(item => item.product.toString() !== productId);
            await cart.save();
            
            return cart.populate('products.product');
        } catch (err) {
            return err.message;
        }
    }

    removeAllProducts = async (cartId) => {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return null;

            cart.products = [];
            await cart.save();
            
            return cart.populate('products.product');
        } catch (err) {
            return err.message;
        }
    }
        

    updateProductQuantity = async (cartId, productId, quantity) => {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return null;

            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
            if (productIndex > -1) {
                cart.products[productIndex].quantity = quantity;
                await cart.save();
                return cart.populate('products.product');
            }
            return null;
        } catch (err) {
            return err.message;
        }
    }
}

export default CartController;
import CartModel from './models/cartsModel.js';
import config from '../config.js';

class CartController {
    constructor() {}

    get = async (filter = {}) => {
        try {
            return await CartModel.find(filter).populate(config.PRODUCTS_COLLECTION).lean();
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
            return await CartModel.findOneAndUpdate(filter, updated, options).populate(config.PRODUCTS_COLLECTION).lean();
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

    updateProductQuantity = async (cartId, productId, quantity) => {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return null;

            const productIndex = cart.products.findIndex(product => product.id === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;
                await cart.save();
                return cart.populate(config.PRODUCTS_COLLECTION).lean();
            }
            return null;
        } catch (err) {
            return err.message;
        }
    }

    removeProduct = async (cartId, productId) => {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return null;

            cart.products = cart.products.filter(product => product.id !== productId);
            await cart.save();
            return cart.populate(config.PRODUCTS_COLLECTION).lean();
        } catch (err) {
            return err.message;
        }
    }
}

export default CartController
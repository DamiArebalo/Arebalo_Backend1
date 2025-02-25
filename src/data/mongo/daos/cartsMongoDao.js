import MongoDao from './mongoDao.js';
import CartModel from '../models/cartsModel.js';

class CartMongoDao extends MongoDao {
    constructor() {
        super(CartModel);
    }

    async get(filter = {}) {
        try {
            return await CartModel.findOne(filter).populate('products.product');
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async add(data) {
        try {
            return await CartModel.create(data);
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async update(filter, updated, options = { new: true }) {
        try {
            return await CartModel.findOneAndUpdate(filter, updated, options);
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async delete(filter) {
        try {
            return await CartModel.findOneAndDelete(filter);
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async addProduct(cartId, productId, quantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return null;

            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity || 1;
            } else {
                cart.products.push({ product: productId, quantity: quantity || 1 });
            }

            await cart.save();
            return cart.populate('products.product');
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async removeProduct(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return null;

            cart.products = cart.products.filter(item => item.product.toString() !== productId);
            await cart.save();
            
            return cart.populate('products.product');
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async removeAllProducts(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return null;

            cart.products = [];
            await cart.save();
            
            return cart.populate('products.product');
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return null;

            const productIndex = cart.products.findIndex(item => item.product.toString() === productId.toString());
            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
                await cart.save();
                return cart.populate('products.product');
            } else {
                return null;
            }
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async sumProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return null;

            const productIndex = cart.products.findIndex(item => item.product.toString() === productId.toString());
            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
                await cart.save();
                return cart.populate('products.product');
            } else {
                return null;
            }
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async findProductExist(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return null;

            const productExist = cart.products.some(item => item.product.toString() === productId.toString());
            return productExist;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async findProduct(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return -1;

            const productIndex = cart.products.findIndex(item => item.product.toString() === productId.toString());
            return productIndex;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async userExist(userId) {
        try {
            const cart = await CartModel.findOne({ user: userId });
            return cart ? cart : false;
        } catch (err) {
            throw new Error('Error al verificar la existencia del usuario en el carrito: ' + err.message);
        }
    }
}

export default CartMongoDao;

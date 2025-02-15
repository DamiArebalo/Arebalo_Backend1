import CartModel from '../models/cartsModel.js';


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

    addProduct = async (cartId, productId, quantity) => {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return null;

            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

            if (productIndex > -1) {
                // Si el producto ya está en el carrito, incrementa la cantidad
                cart.products[productIndex].quantity += quantity || 1;
            } else {
                // Si el producto no está en el carrito, agrégalo
                cart.products.push({ product: productId, quantity:  quantity || 1 });
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
            if (!cart){
                console.log("no existe el carrito");
                return null;

            } 

            //console.log(cart);
            const productIndex = cart.products.findIndex(item => item.product.toString() === productId.toString());
            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
                await cart.save();
                return cart.populate('products.product');
            }else{
                console.log("producto no encontrado");
                return null;
            }
            
        } catch (err) {
            return err.message;
        }
    }

    sumProductQuantity = async (cartId, productId, quantity) => {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart){
                console.log("no existe el carrito");
                return null;

            } 

            console.log(cart);
            const productIndex = cart.products.findIndex(item => item.product.toString() === productId.toString());
            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
                await cart.save();
                return cart.populate('products.product');
            }else{
                console.log("producto no encontrado");
                return null;
            }
            
        } catch (err) {
            return err.message;
        }
    }

    
    findProductExist = async (cartId, productId) => {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return null;
            
            const productExist = cart.products.some(item => item.product.toString() === productId.toString());
            //console.log("existe?: "+productExist);
            return productExist;
            
        } catch (err) {
            return false;
        }
    }

    findProduct = async (cartId, productId) => {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return -1; 
            
            const productIndex = cart.products.findIndex(item => item.product.toString() === productId.toString());
            //console.log("Índice del producto: " + productIndex);
            return productIndex; 
            
        } catch (err) {
            return -1; 
        }
    }

    userExist = async (userId) => {
        try {
            const cart = await CartModel.findOne({ user: userId });
            return cart ? cart : false;
        } catch (err) {
            console.error('Error al verificar la existencia del usuario en el carrito:', err);
            return false;
        }
    }
    
    
}

export default CartController;
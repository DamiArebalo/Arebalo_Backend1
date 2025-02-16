import CartModel from '../models/cartsModel.js';

// Controlador para manejar las operaciones relacionadas con los carritos de compra
class CartController {
    constructor() {}

    // Obtener un carrito con un filtro específico
    get = async (filter = {}) => {
        try {
            // Encuentra un carrito y popula los productos
            return await CartModel.findOne(filter).populate('products.product');
        } catch (err) {
            return err.message;
        }
    }

    // Agregar un nuevo carrito
    add = async (data) => {
        try {
            // Crea un nuevo carrito
            return await CartModel.create(data);
        } catch (err) {
            return err.message;
        }
    }

    // Actualizar un carrito existente
    update = async (filter, updated, options = { new: true }) => {
        try {
            // Encuentra y actualiza un carrito
            return await CartModel.findOneAndUpdate(filter, updated, options);
        } catch (err) {
            return err.message;
        }
    }

    // Eliminar un carrito
    delete = async (filter) => {
        try {
            // Encuentra y elimina un carrito
            return await CartModel.findOneAndDelete(filter);
        } catch (err) {
            return err.message;
        }
    }

    // Agregar un producto al carrito
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

    // Eliminar un producto del carrito
    removeProduct = async (cartId, productId) => {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return null;

            // Filtra y elimina el producto del carrito
            cart.products = cart.products.filter(item => item.product.toString() !== productId);
            await cart.save();
            
            return cart.populate('products.product');
        } catch (err) {
            return err.message;
        }
    }

    // Eliminar todos los productos del carrito
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
        
    // Actualizar la cantidad de un producto en el carrito
    updateProductQuantity = async (cartId, productId, quantity) => {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart){
                console.log("no existe el carrito");
                return null;
            } 

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

    // Incrementar la cantidad de un producto en el carrito
    sumProductQuantity = async (cartId, productId, quantity) => {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart){
                console.log("no existe el carrito");
                return null;
            } 

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

    // Verificar si un producto existe en el carrito
    findProductExist = async (cartId, productId) => {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return null;
            
            // Comprueba si el producto existe en el carrito
            const productExist = cart.products.some(item => item.product.toString() === productId.toString());
            return productExist;
            
        } catch (err) {
            return false;
        }
    }

    // Encontrar el índice de un producto en el carrito
    findProduct = async (cartId, productId) => {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return -1; 
            
            const productIndex = cart.products.findIndex(item => item.product.toString() === productId.toString());
            return productIndex; 
            
        } catch (err) {
            return -1; 
        }
    }

    // Verificar si un usuario ya tiene un carrito
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

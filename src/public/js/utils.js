// importar y crear instancias de controladores
import ProductController from '../../data/mongo/controllers/productController.js';
const productController = new ProductController();

import CartController from '../../data/mongo/controllers/cartsController.js';
const cartController = new CartController();

import CategoryController from '../../data/mongo/controllers/categoryController.js';
const categoryController = new CategoryController(); 

import UserController from '../../data/mongo/controllers/userController.js';
const userController = new UserController();

// importar funciones de utilidad de token
import { verifyTokenUtil } from '../../utils/token.util.js';

//función para agregar un producto al carrito
const createCart = async (data, user) => {

    //recuperar producto por su código
    const product = await getProductByCode(data.productId);
    //guardar idProducto en data
    data.productId = product._id;

    //actualizar data del producto con el id del usuario
    data.user = user._id;
    console.log("data: ", data);

    const newCart = await cartController.add(data); // Intentar crear carrito
    console.log("newCart: ", newCart);

    if (newCart) {
        //actualizar user.cart
        const updatedUser = await userController.update(user._id, { cart: newCart._id });
        console.log("updatedUser: ", updatedUser);

        //agregar producto al carrito
        const addToCart = await cartController.addProduct(newCart._id, data.productId, data.quantity);
        console.log("addToCart: ", addToCart);

        return addToCart;

    }else{
        return null;
    }    

};

// funcion para agregar un nuevo producto
const updatedCart = async (user, data) => {

    //recuperar producto por su código
    const product = await getProductByCode(data.productId);
    //guardar idProducto en data
    data.productId = product._id;

    //si existe producto en el carrito actualizar la cantidad
    const productExits = await cartController.findProductExist(user.cart, data.productId);

    console.log("productExits: ", productExits);
    if (productExits) {
        //actualizar cantidad
        const updatedCart = await cartController.updateProductQuantity(user.cart, data.productId, data.quantity);
        
        console.log("updateCart: ", updatedCart);

       return { message: 'Carrito actualizado', data: updatedCart };
    }else{
        //agregar producto al carrito
        const addToCart = await cartController.addProduct(user.cart, data.productId, data.quantity);
        console.log("addToCart: ", addToCart);
        
        return { message: 'Producto Agregado al carrito', data: addToCart };
    }

};



//función para obtener el usuario por el token
const getUser = async (req) => {
    const verifydata = verifyTokenUtil(req.token)
    console.log(verifydata);

    const userLog = await userController.readById(verifydata._id)
    console.log(userLog);
    
}

const getUserByToken = async (token) => {
    const verifydata = verifyTokenUtil(token);
    //console.log("verifydata: ", verifydata);

    const userID = await verifydata._id;
    //console.log("userID: ", userID);

    const user = await userController.readById(userID);
    //console.log("user: ", user);

    return user;
}

const getProductByCode = async (code) => {
    const product = await productController.getByCode(code);
    //console.log("product: ", product);

    return product;
}



export { createCart,updatedCart, getUser, getUserByToken};

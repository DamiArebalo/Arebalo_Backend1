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

// crear variables globales
let sesionCart;

//función para agregar un producto al carrito
const addToCart = async (data) => {

    //puesto de control
    //console.log("data inicial: ",data);

    //crear carrito si no existe
    const cart = await cartController.get({ _id: sesionCart });

    //recuperar producto por su código
    const productId = await productController.getByCode(data.productId);
    
    //actualizar datos del producto
    data.productId = productId;
    
    //puesto de control
    // console.log("data actualizada 1: ", data);
    // console.log("cart incial: ", cart);
    
    //si el carrito no existe, crear un nuevo
    if(cart==null){
        
        const newCart = await cartController.add({products: [{product : data.productId, quantity: data.quantity}]});

        //puesto de control
        // console.log("newCart: ", newCart);

        //actualizar id del carrito
        data.cartId = newCart._id;

        //puesto de control
       // console.log("data actualizada 2: ", data);

       //actualizar sessionCart
        sesionCart = data.cartId;

        //puesto de control
        // console.log("sesionCart: ", sesionCart);

        return newCart;
    
        
    }else{
        //console.log("verifico array",cart.products);
        //verificar si el producto ya existe en el carrito
        const exists = cart.products.some(item => item.product._id.equals(data.productId));

        //puesto de control
        //console.log("exists: ", exists);

        //si el producto ya existe en el carrito, actualizar la cantidad
        if (exists) {
            
            const updatedProduct = await cartController.sumProductQuantity(sesionCart, data.productId, data.quantity);

            //puesto de control
            //console.log("Producto actualizado: ", updatedProduct);

            return updatedProduct;

        }else{ //si el producto no existe en el carrito, agregarlo

            const updatedCart = await cartController.addProduct(sesionCart, data.productId, data.quantity);

            //puesto de control
            //console.log("cart actualizada: ", updatedCart);

            return updatedCart;
        }
            
    }

    



};

// funcion para agregar un nuevo producto
const addOneProduct = async (productData) => {

    // recuperar info de categoria
    const category = await categoryController.findByName(productData.category);

    //puesto de control
    //console.log("category: ", category);

    // agregar info de categoria al producto
    productData.category = category._id;

    //puesto de control
    //console.log("productData: ", productData);

    // agregar producto
    const newProduct = await productController.add(productData)
    //puesto de control
    //console.log("newProduct: ", newProduct);
    return newProduct;
};



//función para obtener el usuario por el token
const getUser = async (req) => {
    const verifydata = verifyTokenUtil(req.token)
    console.log(verifydata);

    const userLog = await userController.readById(verifydata._id)
    console.log(userLog);
    
}




export {  addToCart, addOneProduct, getUser};

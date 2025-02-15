import CustomRouter from "../../utils/customRouter.util.js";
import CartController from "../../data/mongo/controllers/cartsController.js";

import ProductController from "../../data/mongo/controllers/productController.js";
import { verifyTokenUtil } from "../../utils/token.util.js";

import UserController from "../../data/mongo/controllers/userController.js";
import e from "express";

const userController = new UserController();

class CartsRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.create('/', createCart)
        this.read('/:cid', readCart)
        this.create('/:cid/products/:pid', addProductToCart)
        this.destroy('/:cid/products/:pid', removeProductFromCart)
        this.update('/:cid/products/:pid', updateProductQuantity)
        this.destroy('/:cid', destroyCart)
        this.read('/:user_id', readCartsFromUser)
    }
}


const cartController = new CartController();
const productController = new ProductController();

let cartsRouter = new CartsRouter();
cartsRouter = cartsRouter.getRouter();

export default cartsRouter;

async function readCart(req, res, ) {
    const cartId = req.params.cid;
    const response = await cartController.get({ _id: cartId });
    const message = "CART FOUND"
    if (!response) {
        res.json404();
    }
    res.json200({ response, message })
}

async function readCartsFromUser(req, res, ) {
   
        const { user_id } = req.params
        const message = "CARTS FOUND"
        const response = await cartController.get({ user_id })
        return res.json200({ response, message })
    
}

async function createCart(req, res, next) {

    let token = req.cookies.authToken;

    if (token) {
        try {
            const tokenData = verifyTokenUtil(token); 

            //recupero user
            const user = await userController.readById(tokenData._id);

            //si no existe el usuario, redirigir al login
            if(!user){
                return res.redirect('/views/home/login');
            }
            
            const userId = user._id
            //verificar si existe el carrito del usuario
            const cartExist = await cartController.userExist(userId);
            
            //si existe el carrito del usuario, actualizar el carrito
            if(cartExist){
                //recuperar el id del carrito
                const cartId = cartExist._id;

                //puesto de control
                console.log("cartId: "+cartId);

                //actualizar el carrito
                return (updateCart(req, res, cartId, req.body.productId));
                   
            }else{ //si no existe el carrito del usuario, crear un nuevo
                const message = "CART CREATED";

                //modularizar data del carrito
                let data = {
                    user: userId,
                    products: [{
                        product: await productController.getByCode(req.body.productId),
                        quantity: req.body.quantity
                    }]
                };

                //crear el carrito
                const response = await cartController.add(data);
                
                //puesto de control
                //console.log("carrito creado id: "+response._id)               
                //ejecucion
                return res.json201({ response, message });
            }     
        }catch (error){
            return error;
        }
    }else{ //si no existe el token, redirigir al login
        return res.redirect('/views/home/login');
    }
    
}

async function addProductToCart(req, res, next) {
    const cartId = req.params.cid;
    const productId = req.params.pid;

        const product = await productController.get({ _id: productId });
        if (!product) {
            res.json404();
        }
        const updatedCart = await cartController.addProduct(cartId, productId);
        if (!updatedCart) {
            res.json404();
        }
        res.json200({ response: updatedCart, message: "Cart updated" });
   
}

async function removeProductFromCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const updatedCart = await cartController.removeProduct(cartId, productId);
    if (!updatedCart) {
        res.json404();
       
    }

    res.json200({ response: updatedCart, message: "Product removed" });
}

async function updateProductQuantity(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    const updatedCart = await cartController.updateProductQuantity(cartId, productId, quantity);

    if (!updatedCart) {
        res.json404();  
    }

    res.json200({ response: updatedCart, message: "Product quantity updated" });
}

async  function destroyCart(req, res) {
    const cartId = req.params.cid;
    const updatedCart = await cartController.removeAllProducts(cartId);
    if (!updatedCart) {
        res.json404();       
    }
    res.json200({ response: updatedCart, message: "Cart deleted" });
}

async function updateCart(req, res,cartId,productCode) {  
    //puesto de control
    //console.log("incio de actualizacion");  
   try{
        //verificar si existe el producto
        const product = await productController.getByCode(productCode);
        if (!product) {
            return res.json404();
        }
        //verificar si existe producto en el carrito
        const findProduct = await cartController.findProduct(cartId, product._id);

        //si existe el producto, actualizar cantidad
        if(findProduct !== -1){ 
            //actualizar cantidad
            let updatedCart = await cartController.updateProductQuantity(cartId,product._id, req.body.quantity);    
            
            //ejecucion
            return res.json200({updatedCart, message: "Product quantity updated" });
        }else{
            //si no existe el producto, agregarlo
            let updatedCart = await cartController.addProduct(cartId, product._id, req.body.quantity);
            
            //puesto de control
            //console.log("updatedCart: "+updatedCart);

            let message = "Product Added";
            //ejecucion
            return res.json200(updateCart, message);
        }
        
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        return res.json500();
    }

    
}


import customRouter from "../../utils/customRouter.util.js";

import cartController from '../../controllers/cartController.js';

import historyController from '../../controllers/purchasHistoryController.js';

import userController from "../../controllers/userController.js";

import { socketServer } from '../../app.js';

import { getUserByToken } from "../../public/js/utils.js";




class CartsViewRouter extends customRouter {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.read('/:cid', readCart)
        this.update('/:cid/empty', emptyCart)
        this.destroy('/:cid/purchase',validatePurchase, purchaseCart)
        this.read('/', readCartEmpty)
    }
}

let routerViewsCarts = new CartsViewRouter();
routerViewsCarts = routerViewsCarts.getRouter();

export default routerViewsCarts;

async function readCart(req, res) {
    const cartId = req.params.cid;
    //console.log("cartId: ", cartId);
    const isAuthenticated = true;

    const cart = await cartController.getById({ _id: cartId });
    console.log("cart: ", cart); 

    const token = req.cookies.authToken;
    const user = await getUserByToken(token);

    


    if (!cart) {
        res.json404();
       
    }else{
        res.status(200).render('cart', {
            products : cart.products, 
            total : cart.calculatedTotal, 
            cartId : cartId,
            isAuthenticated: isAuthenticated,

        });
    }

    
    
}

async function emptyCart(req, res) {
    //recupero el id del carrito
    const cartId = req.params.cid;
    //console.log("cartId: ", cartId);    
    
    const updatedCart = await cartController.removeAllProducts({ _id: cartId });
    if (!updatedCart) {
        res.json404();
    }

    res.json200({ response: updatedCart, message: "Carrito vaciado" });
}



async function validatePurchase(req, res, next) {
    console.log("logica de validacion de compra");
    //solo console log por ahora
    
    next();
}

async function purchaseCart(req, res) {
    //recupero el id del carrito
    const cartId = req.params.cid;
    //console.log("cartId: ", cartId);

    //recupero el carrito
    const cart = await cartController.getById({ _id: cartId });
    if (!cart) {
        return res.json404();
    }

    console.log("cart: ", cart);

    // Actualiza el carrito del usuario
    const userId = cart.user; // Asumiendo que cart.user contiene el id del usuario
    const userUpdateResult = await userController.update(userId, { cart: null });
    if (!userUpdateResult) {
        return res.json500({ message: "Failed to update user cart" });
    }
    console.log("userUpdateResult: ", userUpdateResult.cart);

    //formateo de datos para el historial de compras
    const dataHistory = {
        products: cart.products,
        total: cart.calculatedTotal,
        user: userId,
        state: 'done'    
    };

    //ingreso del historial de compras
    const historyCreated = await historyController.create(dataHistory);
    if (!historyCreated) {
        return res.json500({ message: "Failed to create purchase history" });
    }
    console.log("historyCreated: ", historyCreated);

    //elimino el carrito
    const updatedCart = await cartController.delete({ _id: cartId });
    if (!updatedCart) {
        res.json404();
    }
    res.json200({ response: updatedCart, message: "Carrito vaciado y eliminado" });
}

async function readCartEmpty(req, res) {
    const isAuthenticated = true;
    res.render('cart', {
        products : [],
        total : 0, 
        cartId : null,
        isAuthenticated: isAuthenticated,
    });
}




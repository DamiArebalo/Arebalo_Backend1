import customRouter from "../../utils/customRouter.util.js";

import CartController from '../../data/mongo/controllers/cartsController.js';

const cartController = new CartController();

class CartsViewRouter extends customRouter {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.read('/:cid', readCart)
        this.update('/:cid/empty', emptyCart)
    }
}

let routerViewsCarts = new CartsViewRouter();
routerViewsCarts = routerViewsCarts.getRouter();

export default routerViewsCarts;

async function readCart(req, res) {
    const cartId = req.params.cid;
    //console.log("cartId: ", cartId);

    const cart = await cartController.get({ _id: cartId });
    console.log("cart: ", cart); 

    if (!cart) {
        res.json404();
       
    }else{
        res.status(200).render('cart', {products : cart.products, total : cart.calculatedTotal, cartId : cartId});
    }

    
    
}

async function emptyCart(req, res) {
    const cartId = req.params.cid;
    console.log("cartId: ", cartId);
    const updatedCart = await cartController.removeAllProducts({ _id: cartId });
    if (!updatedCart) {
        res.json404();
    }
    res.json200({ response: updatedCart, message: "Carrito vaciado" });
}





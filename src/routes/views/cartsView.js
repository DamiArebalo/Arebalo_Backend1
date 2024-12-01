import customRouter from "../../utils/customRouter.util.js";

import CartController from '../../data/mongo/controllers/cartsController.js';

const cartController = new CartController();

class CartsViewRouter extends customRouter {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.read('/carts/:cid', readCart)
    }
}

let routerViewsCarts = new CartsViewRouter();
routerViewsCarts = routerViewsCarts.getRouter();

export default routerViewsCarts;

async function readCart(req, res) {
    const cartId = req.params.cid;
    const cart = await cartController.get({ _id: cartId });
    console.log("cart: ", cart); 
    if (!cart) {
        res.json404();
       
    }else{
        res.status(200).render('cart', {products : cart.products, total : cart.calculatedTotal, cartId : cartId});
    }
    
}




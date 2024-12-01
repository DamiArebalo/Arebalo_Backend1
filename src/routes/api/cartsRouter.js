import CustomRouter from "../../utils/customRouter.util.js";
import CartController from "../../data/mongo/controllers/cartsController.js";

import ProductController from "../../data/mongo/controllers/productController.js";

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
   
        const message = "CART CREATED"
        const data = req.body
        const response = await cartController.add(data)
        return res.json201({ response, message })
    
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
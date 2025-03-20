import customRouter from "../../utils/customRouter.util.js";

import cartController from '../../controllers/cartController.js';

import historyController from '../../controllers/purchasHistoryController.js';

import userController from "../../controllers/userController.js";

import { socketServer } from '../../app.js';

import { getUserByToken } from "../../public/js/utils.js";

import productController from "../../controllers/productController.js";

import nodemailer from 'nodemailer';    





class CartsViewRouter extends customRouter {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.read('/:cid', readCart)
        this.update('/:cid/empty', emptyCart)
        this.update('/:cid/purchase',validatePurchase, purchaseCart)
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
async function readCartEmpty(req, res) {
    const isAuthenticated = true;
    res.render('cart', {
        products : [],
        total : 0, 
        cartId : null,
        isAuthenticated: isAuthenticated,
    });
}


async function validatePurchase(req, res, next) {
    console.log("logica de validacion de compra");

    
    //solo console log por ahora

    const cartId = req.params.cid;
    //recupero carrito
    console.log("cartIdLogic: ", cartId);
    const cart = await cartController.getById({ _id: cartId });
    console.log("cartLogic: ", cart);


    const productsCarts = cart.products;

    let productsnotAvailables = [];

    //valdiacion de stock
    for (let i = 0; i < productsCarts.length; i++) {
        const product = productsCarts[i];
        let idProd = product.product._id;
        let quaProd = product.quantity;
        const stock = await readStockByProduct(idProd);
        console.log("stock: ", stock);
        console.log("quaProd: ", quaProd);
        if(stock >= quaProd){
            console.log(idProd," OK");
            //actualizo stock del producto
            const updatedProduct = await productController.updateStock(idProd, quaProd);
            if (!updatedProduct) {
                res.json404();
            }
        }else{
            console.log(idProd," ERROR");
            productsnotAvailables.push(product);
            //elimino producto del carrito
            const updatedCart = await cartController.removeProduct({ _id: cartId }, idProd);
            if (!updatedCart) {
                res.json404();
            }

        }
    }
    console.log("productsnotAvailables after for: ", productsnotAvailables);

    if(productsnotAvailables!= undefined || productsnotAvailables.length > 0){
        req.productsNotAvailables = productsnotAvailables;
    }

    

    
    next();
}

async function purchaseCart(req, res) {
    //recupero el id del carrito
    const cartId = req.params.cid;
    console.log("cartIdValidated: ", cartId);

    //recupero el carrito
    const cart = await cartController.getById({ _id: cartId });
    if (!cart) {
        return res.json404();
    }

    console.log("cart Purcahse: ", cart);
    console.log("notAvailProducts: ", req.productsNotAvailables);

    if(req.productsNotAvailables.length == 0){
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
            user: cart.user,
            state: 'done'    
        };

        //console.log("dataHistory: ", dataHistory);

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

        //envio de mail
        mailer(req, res,userUpdateResult, dataHistory.products, dataHistory.total);
        
        res.json200({ response: updatedCart, message: "Carrito vaciado y eliminado" });

    }else{
        //formateo de datos para el historial de compras
        const dataHistory = {
            products: cart.products,
            total: cart.calculatedTotal,
            user: cart.user,
            state: 'done'    
        };

        //console.log("dataHistoryElse: ", dataHistory);

        //ingreso del historial de compras
        const historyCreated = await historyController.create(dataHistory);
        if (!historyCreated) {
            return res.json500({ message: "Failed to create purchase history" });
        }
        //console.log("historyCreated: ", historyCreated);

        const cartEmpty = await cartController.removeAllProducts({ _id: cartId });
        if (!cartEmpty) {
            res.json404();
        }

        //colocar productos no disponibles al carrito
        const cartnotAvail = await cartController.addProduct({ _id: cartId }, req.productsNotAvailables);
        if (!cart) {
            res.json404();
        }
        console.log("cart no disponibles: ", cartnotAvail);


    }

    
}


async function readStockByProduct(productId) {
    const product = await productController.getById({_id: productId});
    console.log("product: ", product);
    return product.stock;
}

async function mailer(req, res, user, products, total) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });
    const mailOptions = {
        from: `RITYJUST <${process.env.GMAIL_USER}>`,
        to: `${user.email}`,
        subject: 'RITY JUST - Compra',
        html: ` <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirmación de Compra</title>
                    <link rel="stylesheet" href="../../public/css/mail.css">
                </head>
                <body>
                    <div class="container">
                        <div class="banner">
                            <img src="cid:banner-image" alt="Gracias por tu compra">
                        </div>
                        <div class="content">
                            <h2>¡Gracias por tu compra ${user.name}!</h2>
                            <p>Estos son los detalles de tu pedido:</p>
                            <ul>
                                ${products.map(product => `
                                    <li>
                                        <strong>Título:</strong> ${product.product.title}<br>
                                        <strong>Descripción:</strong> ${product.product.description}<br>
                                        <strong>Precio:</strong> ${product.product.priceList}<br>
                                        <strong>Cantidad:</strong> ${product.quantity}
                                    </li>
                                `).join('')}
                            </ul>
                            <h3>Total: ${total}</h3>
                        </div>
                        <div class="footer">
                            <p>RITY JUST - ¡Esperamos verte pronto!</p>
                        </div>
                    </div>
                </body>`,
        attachments: [
            {
                filename: 'banner.png',
                path: "./src/public/img/thanksyou.png",
                cid: 'banner-image'
            }
        ]
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.json500({ message: 'Error al enviar el mail' });
        } else {
            console.log('Email enviado');
            res.json200({ message: 'Email enviado' });
        }
    });
}


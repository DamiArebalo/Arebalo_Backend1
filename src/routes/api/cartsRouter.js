import CustomRouter from "../../utils/customRouter.util.js";
import cartController from "../../controllers/cartController.js";
import productController from "../../controllers/productController.js";
import { verifyTokenUtil } from "../../utils/token.util.js";
import userController from "../../controllers/userController.js";



// Define el enrutador para las operaciones del carrito de compras
class CartsRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }
    // Inicializa las rutas del enrutador
    init = () => {
        this.create('/', createCart);
        this.read('/:cid', readCart);
        this.create('/:cid/products/:pid', addProductToCart);
        this.destroy('/:cid/products/:pid', removeProductFromCart);
        this.update('/:cid/products/:pid', updateProductQuantity);
        this.destroy('/:cid', destroyCart);
        this.read('/:user_id', readCartsFromUser);
    }
}



let cartsRouter = new CartsRouter();

cartsRouter = cartsRouter.getRouter();

export default cartsRouter;

// Función para leer un carrito específico por su ID
async function readCart(req, res) {
    const cartId = req.params.cid;
    const response = await cartController.getById({ _id: cartId });
    const message = "CART FOUND";
    if (!response) {
        res.json404();
    }
    res.json200({ response, message });
}

// Función para leer los carritos de un usuario específico
async function readCartsFromUser(req, res) {
    const { user_id } = req.params;
    const message = "CARTS FOUND";
    const response = await cartController.getById({ user_id });
    return res.json200({ response, message });
}

// Función para crear un nuevo carrito
async function createCart(req, res, next) {
    let token = req.cookies.authToken;

    if (token) {
        try {
            const tokenData = verifyTokenUtil(token); 

            // Recuperar usuario
            const user = await userController.getById(tokenData._id);

            // Si no existe el usuario, redirigir al login
            if (!user) {
                return res.redirect('/views/home/login');
            }
            
            const userId = user._id;
            // Verificar si existe el carrito del usuario
            const cartExist = await cartController.userExist(userId);
            
            // Si existe el carrito del usuario, actualizar el carrito
            if (cartExist) {
                const cartId = cartExist._id;

                // Actualizar el carrito
                return (updateCart(req, res, cartId, req.body.productId));
            } else { // Si no existe el carrito del usuario, crear uno nuevo
                const message = "CART CREATED";

                let data = {
                    user: userId,
                    products: [{
                        product: await productController.getByCode(req.body.productId),
                        quantity: req.body.quantity
                    }]
                };

                // Crear el carrito
                const response = await cartController.add(data);
                return res.json201({ response, message });
            }     
        } catch (error) {
            return error;
        }
    } else { // Si no existe el token, redirigir al login
        return res.redirect('/views/home/login');
    }
}

// Función para agregar un producto al carrito
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

// Función para eliminar un producto del carrito
async function removeProductFromCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const updatedCart = await cartController.removeProduct(cartId, productId);
    if (!updatedCart) {
        res.json404();
    }

    res.json200({ response: updatedCart, message: "Product removed" });
}

// Función para actualizar la cantidad de un producto en el carrito
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

// Función para eliminar definitivamente el carrito
async function destroyCart(req, res) {
    const cartId = req.params.cid;
    
    // Recupera el carrito antes de eliminar los productos
    const cart = await cartController.getById( { _id: cartId });
    if (!cart) {
        return res.json404();
    }


    // Actualiza el carrito del usuario
    const userId = cart.user; // Asumiendo que cart.user contiene el id del usuario
    const userUpdateResult = await userController.update(userId, { cart: null });
    if (!userUpdateResult) {
        return res.json500({ message: "Failed to update user cart" });
    }
    console.log("userUpdateResult: ", userUpdateResult.cart);

    // Elimina definitivamente el carrito de la base de datos
    const deleteResult = await cartController.delete({ _id: cartId });
    if (!deleteResult) {
        return res.json500({ message: "Failed to delete cart" });
    }

    res.json200({ response: deleteResult, message: "Cart deleted permanently" });
}

// Función para actualizar o agregar un producto en el carrito
async function updateCart(req, res, cartId, productCode) {  
    try {
        // Verificar si existe el producto
        const product = await productController.getByCode(productCode);
        if (!product) {
            return res.json404();
        }
        // Verificar si existe el producto en el carrito
        const findProduct = await cartController.findProduct(cartId, product._id);

        // Si existe el producto, actualizar cantidad
        if (findProduct !== -1) {
            let updatedCart = await cartController.updateProductQuantity(cartId, product._id, req.body.quantity);    
            return res.json200({ updatedCart, message: "Product quantity updated" });
        } else {
            // Si no existe el producto, agregarlo
            let updatedCart = await cartController.addProduct(cartId, product._id, req.body.quantity);
            let message = "Product Added";
            return res.json200(updatedCart, message);
        }
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        return res.json500();
    }
}

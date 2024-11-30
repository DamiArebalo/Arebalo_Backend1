import ProductController from '../../data/mongo/controllers/productController.js';
const productController = new ProductController();

import CartController from '../../data/mongo/controllers/cartsController.js';
const cartController = new CartController();

import CategoryController from '../../data/mongo/controllers/categoryController.js';
const categoryController = new CategoryController();    




let sesionCart;

const addToCart = async (data) => {

    console.log("data inicial: ",data);

    const cart = await cartController.get({ _id: sesionCart });

    const productId = await productController.getByCode(data.productId);

    data.productId = productId;
    
    console.log("data actualizada 1: ", data);
    console.log("cart incial: ", cart);
    

    if(cart==null){
        
        const newCart = await cartController.add({products: [{product : data.productId, quantity: data.quantity}]});
        console.log("newCart: ", newCart);
        data.cartId = newCart._id;
        console.log("data actualizada 2: ", data);
        sesionCart = data.cartId;

        console.log("sesionCart: ", sesionCart);
        return newCart;
    
        
    }else{
        //console.log("verifico array",cart.products);
        const exists = cart.products.some(item => item.product._id.equals(data.productId));
        console.log("exists: ", exists);

        if (exists) {
            const updatedProduct = await cartController.sumProductQuantity(sesionCart, data.productId, data.quantity);
            console.log("Producto actualizado: ", updatedProduct);

            return updatedProduct;
        }else{
            const updatedCart = await cartController.addProduct(sesionCart, data.productId, data.quantity);
            console.log("cart actualizada: ", updatedCart);
            return updatedCart;
        }
            
    }

    



};

const addOneProduct = async (productData) => {
    const category = await categoryController.findByName(productData.category);
    console.log("category: ", category);
    productData.category = category._id;

    //  console.log("productData: ", productData);

    const newProduct = await productController.add(productData)
    console.log("newProduct: ", newProduct);
    return newProduct;
};


export {  addToCart, addOneProduct};

import ProductController from '../../dao/productController.js';
const productController = new ProductController();

import CartController from '../../dao/cartsController.js';
const cartController = new CartController();

import CategoryController from '../../dao/categoryController.js';
const categoryController = new CategoryController();    



// Función para transformar el resultado de la paginación
function transformPaginationResult(products, route) {
    return {
        status: "success",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `/${route}/?page=${products.prevPage}` : null,
        nextLink: products.hasNextPage ? `/${route}/?page=${products.nextPage}` : null,
    };
}

// Función para encontrar el producto por ID usando el controlador
async function indexExists(vId) {
    const product = await productController.get({ code: vId });
    return product ? product : false;
}

// Función para validar los productos
function validateProducts(priceList, description, stock) {
    let parsedPrice = parseFloat(priceList);
    let parsedStock = parseInt(stock);
    
    const valDescription = description => description.length <= 50;
    const valPrice = parsedPrice => !isNaN(parsedPrice) && parsedPrice >= 0;
    const valStock = parsedStock => parsedStock >= 0;

    return valStock(parsedStock) && valPrice(parsedPrice) && valDescription(description);
}

// Middleware para validar la data
const midVal = (req, res, next) => {
    if (!validateProducts(req.body.priceList, req.body.description, req.body.stock)) {
        return res.status(406).send({ error: "Los datos ingresados no son válidos", data: null });
    }
    next();
};

// Middleware para validar si todos los datos necesarios están incluidos
const midExists = (req, res, next) => {
    const datoFormu = req.body;
    if (['title', 'description', 'code', 'priceList', 'stock', 'category'].every(field => field in datoFormu)) {
        next();
    } else {
        res.status(400).send({ error: 'Faltan Datos Necesarios', data: null });
    }
};

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


export { transformPaginationResult, indexExists, midVal, midExists, addToCart, addOneProduct};

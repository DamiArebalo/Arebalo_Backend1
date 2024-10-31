import ProductController from '../../dao/productController.js';
const productController = new ProductController();

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

export { transformPaginationResult, indexExists, midVal, midExists };

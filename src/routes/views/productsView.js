import CustomRouter from '../../utils/customRouter.util.js';
import { socketServer } from '../../app.js';


import productController from '../../controllers/productController.js';

import { midVal, midExists } from '../../utils/validateProducts.js';
import categoryController from '../../controllers/categoryController.js';
import validateUser from '../../middlewares/validateUser.mid.js';
import validateAdmin from '../../middlewares/validateAdmin.mid.js';



class ProductsViewRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.read('/', listProducts)
        this.read('/realtimeproducts', listProducts)
        this.create('/realtimeproducts',validateUser,validateAdmin, midVal, midExists, createProduct)
    }
}

let routerViewsProducts = new ProductsViewRouter();
routerViewsProducts = routerViewsProducts.getRouter();

export default routerViewsProducts;

async function listProducts(req, res) {
    const { limit, page, sort, query } = req.query; // Agregar el parámetro sort

    const sortOrder = sort === 'desc' ? -1 : (sort === 'asc' ? 1 : null);

    const options = {
        limit: parseInt(limit) || 10,
        page: parseInt(page) || 1,
        sort: sortOrder !== null ? { priceList: sortOrder } : {},
        populate: 'category'
        // sort: sort ? { [sort]: 1 } : {} // Ordenar por el campo proporcionado
    };
    // console.log(options);

    const searchQuery = { ...JSON.parse(query || '{}'), status: true };
    const products = await productController.getPaginated(searchQuery, options);
    // console.log(products);
    
    res.status(200).render('home', { 
        products: products,
        route: "/views/products" 
    });
    console.log('Productos paginados y ordenados obtenidos correctamente');
}

async function createProduct(req, res) {

    const datoFormu = req.body;

    datoFormu.category = await categoryController.getByName(datoFormu.category);
    // console.log(datoFormu.priceList);
    //creacion del nuevo producto
    const newProduct = await productController.create({
        code: datoFormu.code,
        title: datoFormu.title,
        priceList: datoFormu.priceList,
        description: datoFormu.description,
        stock: datoFormu.stock,
        category: datoFormu.category._id
    });

    //  console.log(newProduct);
    socketServer.emit('newProduct', newProduct); // Emitir evento a todos los clientes conectados

    res.redirect('/views/realtimeproducts');

    res.send(console.log(`Producto ${datoFormu.title} Agregado correctamente`));
}


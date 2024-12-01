import CustomRouter from "../../utils/customRouter.util.js";
import { uploader } from "../../uploader.js";

import ProductController from "../../data/mongo/controllers/productController.js";
import { indexExists, midVal, midExists } from '../../utils/validateProducts.js';
import transformPaginationResult from '../../utils/transformPaginated.js';
import CategoryController from "../../data/mongo/controllers/categoryController.js";



class ProductsApiRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.create('/', midVal, midExists, uploader.single('thumbnail'), createProduct)
        this.read('/', listProducts)
        this.read('/:id', listOneProduct)
        this.update('/:id', updateProduct)
        this.destroy('/:id', deleteProduct)
        this.read('/stats/:limit', statsProducts)
    }
}

// Crear una instancia del controlador
const productController = new ProductController();
const categoryController = new CategoryController();

//GET --> Listado de productos generales con un limite incluido

async function listProducts(req, res, next) {

    const route = "api/products";
    const { limit, page, sort, categoryName, available } = req.query; // Agregar el parámetro sort

    const sortOrder = sort === 'desc' ? -1 : (sort === 'asc' ? 1 : null);

    const filter = {};
    //si se usa categoria
    if (categoryName) {

        //buscar la categoría
        const category = await categoryController.findByName(categoryName);
        //si la categoría existe
        if (category) {
            //usar el ID de la categoría encontrada
            filter.category = category._id; // Usar el ID de la categoría encontrada
        } else {
            // si no existe, devolver error
            res.json404();
        }
    }
    //si se usa disponibilidad
    if (available === 'true' || available === 'false') {
        //disponibles o No disponibles
        filter.stock = available === 'true' ? { $gt: 0 } : 0;

    } else if (available !== undefined) {
        //arrojar error
        res.json400("El parámetro available debe ser \"true\" o \"false\".");
    } else {
        filter.stock = { $gt: 0 }; // Disponibilidad por defecto
    }

    const options = {
        limit: parseInt(limit) || 10,
        page: parseInt(page),
        sort: sortOrder !== null ? { priceList: sortOrder } : {},
        // sort: sort ? { [sort]: 1 } : {} // Ordenar por el campo proporcionado
        populate: 'category'
    };

    //obtener los productos paginados y ordenados
    const products = await productController.getPaginated(filter, options);
    //transformar los resultados en el formato esperado
    const result = transformPaginationResult(products, route);
    //enviar el resultado
    res.json200({response: result, message: "Products found"});
    
}

//GET --> mostrando solo un producto filtrando por su ID
async function listOneProduct(req, res) {
    const id = parseInt(req.params.id);

    const product = await productController.get({ _id: id });

    if (!indexExists(id)) {
        res.json404();
        
    } else {
        res.json200({ response: product, message: "Product found" });
    }

}

async function updateProduct(req, res) {

    const productCode = req.params.id;
    const updatedData = req.body;
    const filter = ""

    //validacion del parametro
    if (!indexExists(productCode)) {
        res.json404();
    }

    if (productCode == await productController.get({ _id: productCode })) {
        filter = { _id: productCode }
    } else {
        filter = { code: productCode };
    }

    //console.log(await productController.get({ filter }));

    // No permitir la actualización del ID
    if (updatedData.hasOwnProperty('_id') || updatedData.hasOwnProperty('code')) {
        console.warn(`Intento de modificacion de id/code: ${productCode} Bloqueado Correctamente`)
        res.json400('No se puede actualizar el ID/CODE del producto');
    }

    const updatedProduct = await productController.update(filter, updatedData);
    res.json200({ response: updatedProduct, message: "Product updated" });
    console.log(`Producto ${await productController.get({ filter })} actualizado correctamente`);
}

async function createProduct(req, res) {

    const datoFormu = req.body
    //creacion del nuevo producto

    //const newProduct = new Product(maxId+1,datoFormu.code,datoFormu.title,datoFormu.priceList,datoFormu.description,datoFormu.stock,datoFormu.category);
    const newProduct = await productController.add({
        code: datoFormu.code,
        title: datoFormu.title,
        priceList: datoFormu.priceList,
        description: datoFormu.description,
        stock: datoFormu.stock,
        category: datoFormu.category
    });
    res.json200({ response: { newProduct, thumbnail: req.file }, message: "Product added" });
    
    res.send(console.log(`Producto ${datoFormu.title} Agregado correctamente`));

}

async function deleteProduct(req, res) {
    const productId = req.params.id;
    console.log(productModel.find());
    //validacion del parametro
    if (!indexExists(productId)) {
        res.json404();
    }

    // Eliminar el producto del array
    const deletedProduct = productController.delete({ code: productId });
    res.json200({ response: deletedProduct, message: "Product deleted" });
    
}

async function statsProducts(req, res) {

    const limit = parseInt(req.params.limit);

    const stats = await productController.stats(limit);
    res.json200({ response: stats, message: "Statistics found" });
}

let productsRouter = new ProductsApiRouter();
productsRouter = productsRouter.getRouter();

export default productsRouter;


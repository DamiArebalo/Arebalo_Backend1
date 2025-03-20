import CustomRouter from "../../utils/customRouter.util.js";
import productController from "../../controllers/productController.js";
import { indexExists, midVal, midExists } from '../../utils/validateProducts.js';
import transformPaginationResult from '../../utils/transformPaginated.js';
import categoryController from "../../controllers/categoryController.js";
import validateUser from "../../middlewares/validateUser.mid.js";
import validateAdmin from "../../middlewares/validateAdmin.mid.js";

// Define el enrutador para las operaciones de productos
class ProductsApiRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }
    // Inicializa las rutas del enrutador
    init = () => {
        this.create('/',validateUser,validateAdmin, midVal, midExists, createProduct); // Ruta para crear un producto
        this.read("/", listProducts); // Ruta para listar productos
        this.read('/:id',validateUser, listOneProduct); // Ruta para listar un producto específico
        this.update('/:id',validateUser,validateAdmin, updateProduct); // Ruta para actualizar un producto
        this.destroy('/:id',validateUser,validateAdmin, deleteProduct); // Ruta para eliminar un producto
        this.read('/stats/:limit',validateUser, groupByStock); // Ruta para obtener estadísticas de productos
        this.read('/get/all/',validateUser, getAllProducts); // Ruta para obtener todos los productos
    }
}



// GET --> Listado de productos generales con un límite incluido
async function listProducts(req, res, next) {
    const route = "api/products";
    const { limit, page, sort, categoryName, available } = req.query; // Agregar el parámetro sort

    const sortOrder = sort === 'desc' ? -1 : (sort === 'asc' ? 1 : null);

    const filter = {};
    // Filtrar por categoría
    if (categoryName) {
        const category = await categoryController.getByName(categoryName);
        if (category) {
            filter.category = category._id; // Usar el ID de la categoría encontrada
        } else {
            res.json404();
        }
    }
    // Filtrar por disponibilidad
    if (available === 'true' || available === 'false') {
        filter.stock = available === 'true' ? { $gt: 0 } : 0;
    } else if (available !== undefined) {
        res.json400("El parámetro available debe ser \"true\" o \"false\".");
    } else {
        filter.stock = { $gt: 0 }; // Disponibilidad por defecto
    }

    const options = {
        limit: parseInt(limit) || 10,
        page: parseInt(page),
        sort: sortOrder !== null ? { priceList: sortOrder } : {},
        populate: 'category'
    };

    // Obtener los productos paginados y ordenados
    const products = await productController.getPaginated(filter, options);
    // Transformar los resultados en el formato esperado
    const result = transformPaginationResult(products, route);
    // Enviar el resultado
    res.json200({response: result, message: "Products found"});
}

// GET --> Mostrar solo un producto filtrando por su ID
async function listOneProduct(req, res) {
    const id = req.params.id;
    //console.log("id prod: ", id);

    const product = await productController.getById(id);

    if (!indexExists(id)) {
        res.json404();
    } else {
        res.json200({ response: product, message: "Product found" });
    }
}

// Función para actualizar un producto
async function updateProduct(req, res) {
    const productId = req.params.id;
    const updatedData = req.body;
    

    

    // No permitir la actualización del ID
    if (updatedData.hasOwnProperty('_id') || updatedData.hasOwnProperty('code')) {
        console.warn(`Intento de modificación de id/code: ${productId} Bloqueado Correctamente`);
        res.json400('No se puede actualizar el ID/CODE del producto');
    }

    const updatedProduct = await productController.update(productId, updatedData);
    res.json200({ response: updatedProduct, message: "Product updated" });
    console.log(`Producto actualizado correctamente`);
}

// Función para crear un producto
async function createProduct(req, res) {
    const datoFormu = req.body;

    datoFormu.category = await categoryController.getByName(datoFormu.category);

    // Creación del nuevo producto
    const newProduct = await productController.create({
        code: datoFormu.code,
        title: datoFormu.title,
        priceList: datoFormu.priceList,
        description: datoFormu.description,
        stock: datoFormu.stock,
        category: datoFormu.category._id
    });


    res.json200({ response: { newProduct, thumbnail: req.file }, message: "Product added" });
    
    res.send(console.log(`Producto ${datoFormu.title} Agregado correctamente`));
}

// Función para eliminar un producto
async function deleteProduct(req, res) {
    const productId = req.params.id;

    // Validación del parámetro
    if (!indexExists(productId)) {
        res.json404();
    }

    // Eliminar el producto del array
    const deletedProduct = productController.delete({ _id: productId });
    res.json200({ response: deletedProduct, message: "Product deleted" });
}

// Función para obtener estadísticas de productos
async function groupByStock(req, res) {
    const limit = parseInt(req.params.limit);
    const stats = await productController.groupByStock(limit);
    res.json200({ response: stats, message: "Statistics found" });
}

// Función para obtener todos los productos
async function getAllProducts(req, res) {
    const products = await productController.getAllProducts();
    res.json200({ response: products, message: "All products found" });
}

let productsRouter = new ProductsApiRouter();
productsRouter = productsRouter.getRouter();

export default productsRouter;

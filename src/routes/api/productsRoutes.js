import CustomRouter from "../../utils/customRouter.util.js";
import productController from "../../controllers/productController.js";
import { indexExists, midVal, midExists } from '../../utils/validateProducts.js';
import transformPaginationResult from '../../utils/transformPaginated.js';
import categoryController from "../../controllers/categoryController.js";

// Define el enrutador para las operaciones de productos
class ProductsApiRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }
    // Inicializa las rutas del enrutador
    init = () => {
        this.create('/', midVal, midExists, createProduct); // Ruta para crear un producto
        this.read("/", listProducts); // Ruta para listar productos
        this.read('/:id', listOneProduct); // Ruta para listar un producto específico
        this.update('/:id', updateProduct); // Ruta para actualizar un producto
        this.destroy('/:id', deleteProduct); // Ruta para eliminar un producto
        this.read('/stats/:limit', statsProducts); // Ruta para obtener estadísticas de productos
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
        const category = await categoryController.findByName(categoryName);
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
    const id = parseInt(req.params.id);

    const product = await productController.get({ _id: id });

    if (!indexExists(id)) {
        res.json404();
    } else {
        res.json200({ response: product, message: "Product found" });
    }
}

// Función para actualizar un producto
async function updateProduct(req, res) {
    const productCode = req.params.id;
    const updatedData = req.body;
    let filter = "";

    // Validación del parámetro
    if (!indexExists(productCode)) {
        res.json404();
    }

    if (productCode == await productController.get({ _id: productCode })) {
        filter = { _id: productCode };
    } else {
        filter = { code: productCode };
    }

    // No permitir la actualización del ID
    if (updatedData.hasOwnProperty('_id') || updatedData.hasOwnProperty('code')) {
        console.warn(`Intento de modificación de id/code: ${productCode} Bloqueado Correctamente`);
        res.json400('No se puede actualizar el ID/CODE del producto');
    }

    const updatedProduct = await productController.update(filter, updatedData);
    res.json200({ response: updatedProduct, message: "Product updated" });
    console.log(`Producto ${await productController.get({ filter })} actualizado correctamente`);
}

// Función para crear un producto
async function createProduct(req, res) {
    const datoFormu = req.body;

    // Creación del nuevo producto
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

// Función para eliminar un producto
async function deleteProduct(req, res) {
    const productId = req.params.id;

    // Validación del parámetro
    if (!indexExists(productId)) {
        res.json404();
    }

    // Eliminar el producto del array
    const deletedProduct = productController.delete({ code: productId });
    res.json200({ response: deletedProduct, message: "Product deleted" });
}

// Función para obtener estadísticas de productos
async function statsProducts(req, res) {
    const limit = parseInt(req.params.limit);
    const stats = await productController.stats(limit);
    res.json200({ response: stats, message: "Statistics found" });
}

let productsRouter = new ProductsApiRouter();
productsRouter = productsRouter.getRouter();

export default productsRouter;

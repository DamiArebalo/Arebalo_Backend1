import { Router } from "express";
import { uploader } from "../../uploader.js";

import ProductController from "../../data/mongo/controllers/productController.js";
import { transformPaginationResult, indexExists, midVal, midExists } from '../../public/js/utils.js';
import CategoryController from "../../data/mongo/controllers/categoryController.js";
import newError from '../../utils/newError.js';


const router = Router();

// Crear una instancia del controlador
const productController = new ProductController();
const categoryController = new CategoryController();



//GET --> Listado de productos generales con un limite incluido

router.get('/', async (req, res, next) => {

    const route= "api/products";
    const { limit, page, sort,categoryName,available} = req.query; // Agregar el parámetro sort

    const sortOrder = sort === 'desc' ? -1 : (sort === 'asc' ? 1 : null);

    const filter = {};
    //si se usa categoria
    if (categoryName) {
        try {
            //buscar la categoría
            const category = await categoryController.findByName(categoryName);
            //si la categoría existe
            if (category) {
                //usar el ID de la categoría encontrada
                filter.category = category._id; // Usar el ID de la categoría encontrada
            } else {
                // si no existe, devolver error
                newError("Category not found", 404);
            }
        } catch (error) {
            return next(error)
        }
    }
    //si se usa disponibilidad
    if (available === 'true' || available === 'false') {
        //disponibles o No disponibles
        filter.stock = available === 'true' ? { $gt: 0 } : 0; 
        
    } else if (available !== undefined) {
        //arrojar error
        newError("El parámetro available debe ser \"true\" o \"false\".", 400);
    } else {
        filter.stock = { $gt: 0 }; // Disponibilidad por defecto
    }

   // console.log(filter, categoryName, available);
       
    const options = {
        limit: parseInt(limit) || 10, 
        page: parseInt(page),   
        sort: sortOrder !== null ? { priceList: sortOrder } : {},
        // sort: sort ? { [sort]: 1 } : {} // Ordenar por el campo proporcionado
        populate: 'category'
    };
    
    try {
        //obtener los productos paginados y ordenados
        const products = await productController.getPaginated(filter, options);
        //transformar los resultados en el formato esperado
        const result = transformPaginationResult(products, route);
        //enviar el resultado
        res.status(200).json(result);
        console.log('Productos paginados y ordenados obtenidos correctamente');
    } catch (error) {
        newError(error.message, 500);
    }
    
});

//GET --> mostrando solo un producto filtrando por su ID
router.get('/:id', async (req, res) =>{
    const code = parseInt(req.params.id);

    const product = await productController.get({code: code});
    
    if(!indexExists(code)){
        newError('No se encuentra el producto', 404);
    }else {
        res.status(200).json({ error: null, data: product});
    }
    
});

//POST --> Agregar Productos
router.post('/',midVal,midExists,uploader.single('thumbnail'),async (req,res) =>{
    

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
   
    res.status(200).send({error: null, data: newProduct, thumbnail: req.file});
    res.send( console.log(`Producto ${datoFormu.title} Agregado correctamente`));
});


router.put('/:id', async (req, res) => {
    const productCode = req.params.id;
    const updatedData = req.body;
    const filter = {code: productCode};
    
    console.log(await productController.get({code: productCode}));

    //validacion del parametro
    if(!indexExists(productCode)){
        newError('Producto no encontrado', 404);   
    }

    // No permitir la actualización del ID
    if (updatedData.hasOwnProperty('_id')||updatedData.hasOwnProperty('code')) {
        console.warn(`Intento de modificacion de id/code: ${productCode} Bloqueado Correctamente`)
        newError('No se puede actualizar el ID/CODE del producto', 400);
    }

    const updatedProduct = await productController.update(filter, updatedData);

    res.status(200).send({ error: null, data: updatedProduct });
    console.log(`Producto ${await productController.get({code: productCode})} actualizado correctamente`);
});

router.delete('/:code', async (req, res) => {
    const productId = req.params.id;
    console.log(productModel.find());
    //validacion del parametro
    if(!indexExists(productId)){
        newError('Producto no encontrado', 404);
    }

    // Eliminar el producto del array
    const deletedProduct = productController.delete({code: productId});

    res.status(200).send({ error: null, data: deletedProduct });
    console.log(`Producto con ID ${productId} eliminado correctamente`);
});

router.get('/stats/:limit', async (req, res) => {
    const limit = parseInt(req.params.limit);
    try {
        const stats = await productController.stats(limit);
        res.status(200).send({ error: null, data: stats });
        console.log('Estadísticas de productos obtenidas correctamente');
    } catch (error) {
        newError(error.message, 500);
        
    }
});


export default router ;


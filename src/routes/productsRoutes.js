import { Router } from "express";
import { uploader } from "../uploader.js";

import ProductController from "../dao/productController.js";
import { transformPaginationResult, indexExists, midVal, midExists } from '../public/js/utils.js';
import CategoryController from "../dao/categoryController.js";

const router = Router();

// Crear una instancia del controlador
const productController = new ProductController();
const categoryController = new CategoryController();

//GET --> Listado de productos generales con un limite incluido

router.get('/', async (req, res) => {

    const route= "api/products";
    const { limit, page, sort,categoryName,available} = req.query; // Agregar el parámetro sort

    const sortOrder = sort === 'desc' ? -1 : (sort === 'asc' ? 1 : null);

    const filter = {};
    if (categoryName) {
        try {
            const category = await categoryController.findByName(categoryName);
            if (category) {
                filter.category = category._id; // Usar el ID de la categoría encontrada
            } else {
                return res.status(404).send({ status: "error", message: "Category not found" });
            }
        } catch (error) {
            return res.status(500).send({ status: "error", message: error.message });
        }
    }

    if (available === 'true' || available === 'false') {
        filter.stock = available === 'true' ? { $gt: 0 } : 0; // Disponibles o No disponibles
    } else if (available !== undefined) {
        return res.status(400).send({ error: 'El parámetro available debe ser "true" o "false".', data: null });
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
        const products = await productController.getPaginated(filter, options);
        const result = transformPaginationResult(products, route);
        res.status(200).send(result);
        console.log('Productos paginados y ordenados obtenidos correctamente');
    } catch (error) {
        res.status(500).send({ error: error.message, payload: null });
    }
    
});



//GET --> mostrando solo un producto filtrando por su ID
router.get('/:id', async (req, res) =>{
    const code = parseInt(req.params.id);

    const product = await productController.get({code: code});
    
    if(!indexExists(code)){
        res.status(404).send({ error: 'No se encuentra el producto', data: [] });
    }else {
        res.status(200).send({ error: null, data: product});
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
        return res.status(404).send({ error: 'Producto no encontrado', data: null });
    }

    // No permitir la actualización del ID
    if (updatedData.hasOwnProperty('_id')||updatedData.hasOwnProperty('code')) {
        console.warn(`Intento de modificacion de id/code: ${productCode} Bloqueado Correctamente`)
        return res.status(400).send({ error: 'No se puede actualizar el ID/CODE del producto', data: null });
    }

    const updatedProduct = await productController.update(filter, updatedData);

    res.status(200).send({ error: null, data: updatedProduct });
    console.log(`Producto ${await productModel.findOne({code: productCode})} actualizado correctamente`);
});

router.delete('/:code', async (req, res) => {
    const productId = req.params.id;
    console.log(productModel.find());
    //validacion del parametro
    if(!indexExists(productId)){
        return res.status(404).send({ error: 'Producto no encontrado', data: null });
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
        res.status(500).send({ error: error.message, data: null });
    }
});


export default router ;


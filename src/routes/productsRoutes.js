import { Router } from "express";
import { uploader } from "../uploader.js";
import productModel from '../dao/models/productsModel.js';
import ProductController from "../dao/productController.js";

const router = Router();

// Crear una instancia del controlador
const productController = new ProductController();

// Encontrar el producto por ID si lo encuentra devuelve el index si no devuelve false
const indexExists = vId =>{


    //const productIndex = products.findIndex(product => product.id == vId);

const productIndex = productModel.findOne({code: vId});

    if (productIndex === -1) {
        return false;
    }else{
        return productIndex;
    }

}

//GET --> Listado de productos generales con un limite incluido

router.get('/', async (req, res) => {
    try {
        let { limit } = req.query;
        limit = parseInt(limit);

        const data = await productController.get();

        if (!isNaN(limit) && limit > 0) {
            res.status(200).send({ error: null, data: data.slice(0, limit) });
        } else {
            res.status(200).send({ error: null, data: data });
        }
        console.log("Se mostró una lista de Productos");
    } catch (error) {
        res.status(500).send({ error: error.message, data: null });
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

//FUNCION PARA VALIDAR LA ENTRADA DE INFO
function validateProducts(priceList,description,stock){
    //Inicializacion de componentes

    let parsedPrice = parseFloat(priceList);
    let parsedStock = parseInt(stock)

    // Validación para description
    const valDescription = description =>{
        if (description.length > 50) {
           console.error("Error: description no debe exceder los 50caracteres.");
            return false;
        }else{
            return true;
        }
    }

    // Validación para productPrice (precio)
    const valPrice = parsedPrice =>{

        if (isNaN(parsedPrice) || parsedPrice < 0) {
            console.error("Error: priceList debe ser un valor numérico no negativo.");
            return false;
        }else{
            return true;
        }
    }



    // Validación para STOCK
    const valStock = parsedStock =>{

        if (parsedStock < 0) {
            console.error("Error: ID no debe ser un número negativo.");
            return false;
        }else{
            return true;
        }
    }

    //VALIDACION GENERAL
    if(valStock(stock)&& valPrice(priceList)&& valDescription(description)){
        return true
    }else{
        return false
    }



}

//MIDD PARA VALIDAR LA DATA
const midVal = (req, res, next) =>{
    
    if(validateProducts(req.body.priceList,req.body.description,req.body.stock) == false){ 
       return res.status(406).send({error: "Los datos ingresados no son validos", data: null});
    }else{
        next();
    }
}

//MIDD para validar si todos los datos necesarios estan incluidos
const midExists =(req, res,next) =>{
    const datoFormu = req.body

    
    if(datoFormu.hasOwnProperty('title')&&datoFormu.hasOwnProperty('description')
        &&datoFormu.hasOwnProperty('code')&&datoFormu.hasOwnProperty('priceList')
        &&datoFormu.hasOwnProperty('stock')&&datoFormu.hasOwnProperty('category')){
            
        next();
            
    }else{
        res.status(400).send({error: 'Faltan Datos Necesarios', data: null});
        res.send( console.log(`error en proceso de crear producto nuevo`));
    }
}

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

export { midVal, midExists };


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

router.get('/paginated/:page?', async (req, res) => {
    const page = parseInt(req.params.page) || 1;
   // const limit = parseInt(req.params.limit);
    try {
        const products = await productController.getPaginated(page, 5);
        res.status(200).send({ error: null, data: products });
        console.log('Productos paginados obtenidos correctamente');
    } catch (error) {
        res.status(500).send({ error: error.message, data: null });
    }
});

export default router ;


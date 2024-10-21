import { Router } from "express";
import { uploader } from "../uploader.js";
import productModel from '../dao/models/productsModel.js';

const router = Router();

// Encontrar el producto por ID si lo encuentra devuelve el index si no devuelve false
const indexExists = vId =>{


    //const productIndex = products.findIndex(product => product.id == vId);

    const productIndex = productModel.findIndex({code: vId});

    if (productIndex === -1) {
        return false;
    }else{
        return productIndex;
    }

}

//GET --> Listado de productos generales con un limite incluido
router.get('/', async (req, res) =>{
    let { limit } = req.query;
    limit = parseInt(limit);

    const data = await productModel.find().lean();

    if (!isNaN(limit) && limit > 0) {
        res.status(200).send({error : null, data: data.slice(10, limit)});
    }else{
        res.status(200).send({error : null, data: data});
    }
    console.log("Se mostró una lista de Productos");
});

//GET --> mostrando solo un producto filtrando por su ID
router.get('/:id', async (req, res) =>{
    const code = parseInt(req.params.id);

    const product = await productModel.findOne({code: code}).lean();
    
    if(!indexExists(id)){
        res.status(404).send({ error: 'No se encuentra el producto', data: [] });
    }else {
        res.status(200).send({ error: null, data: products[indexExists(id)]});
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
    const newProduct = await productModel.create({
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
    const products = await productModel.find().lean();

    //validacion del parametro
    if(!indexExists(productCode)){
        return res.status(404).send({ error: 'Producto no encontrado', data: null });
    }

    // No permitir la actualización del ID
    if (updatedData.hasOwnProperty('id')) {
        console.warn(`Intento de modificacion de id: ${productCode} Bloqueado Correctamente`)
        return res.status(400).send({ error: 'No se puede actualizar el ID del producto', data: null });
    }

    // Actualizar solo los campos permitidos
    const allowedUpdates = ['code', 'title', 'priceList', 'description', 'stock', 'category','offer','discount','status'];
    allowedUpdates.forEach(field => {
        if (updatedData.hasOwnProperty(field)) {
            products[indexExists(productCode)][field] = updatedData[field];
        }
    });

    res.status(200).send({ error: null, data: products[indexExists(productCode)] });
    console.log(`Producto ${products[indexExists(productCode)].title} actualizado correctamente`);
});

router.delete('/:id', async (req, res) => {
    const productId = req.params.id;

    //validacion del parametro
    if(!indexExists(productId)){
        return res.status(404).send({ error: 'Producto no encontrado', data: null });
    }

    // Eliminar el producto del array
    const deletedProduct = products.splice(indexExists(productId), 1);

    res.status(200).send({ error: null, data: deletedProduct });
    console.log(`Producto con ID ${productId} eliminado correctamente`);
});



export default router ;


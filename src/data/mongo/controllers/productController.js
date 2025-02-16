import { query } from 'express';
import ProductModel from '../models/productsModel.js';
import config from '../../../config.js';

// Controlador para manejar las operaciones relacionadas con los productos
class ProductController {
    constructor() {}

    // Obtener todos los productos con sus categorías
    get = async () => {
        try {
            // Encuentra todos los productos y popula las categorías
            const products = await ProductModel.find()
                .populate({
                    path: 'category',
                    model: config.CATEGORIES_COLLECTION,
                    select: 'name'
                })
                .lean();
            return products;
        } catch (err) {
            return err.message;
        }
    }

    // Agregar un nuevo producto
    add = async (data) => {
        try {
            // Crea un nuevo producto
            return await ProductModel.create(data);
        } catch (err) {
            return err.message;
        }
    }

    // Actualizar un producto existente
    update = async (filter, updated, options) => {
        try {
            // Encuentra y actualiza un producto
            return await ProductModel.findOneAndUpdate(filter, updated, options);
        } catch (err) {
            return err.message;
        }
    }

    // Eliminar un producto
    delete = async (filter, options) => {
        try {
            // Encuentra y elimina un producto
            return await ProductModel.findOneAndDelete(filter, options);
        } catch (err) {
            return err.message;
        }
    }

    // Obtener estadísticas de productos basadas en el stock
    stats = async (limit) => {
        try {
            // Realiza una agregación para obtener estadísticas de productos
            const stats = await ProductModel.aggregate([
                {$match: {stock:limit}},
                { $group: { _id: '$title', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]);
            return stats;
        } catch (err) {
            return err.message;
        }
    }

    // Obtener productos con paginación
    getPaginated = async (query, options) => {
        try {
            // Utiliza el plugin de paginación para obtener productos paginados
            const products = await ProductModel.paginate(query, options);
            return products;
        } catch (err) {
            return err.message;
        }
    }

    // Obtener un producto por su código
    getByCode = async (code) => {
        try {
            // Encuentra un producto por su código, seleccionando solo el campo _id
            const product = await ProductModel.findOne({ code: code }, '_id');
            console.log("intento de obtener producto: ", code, product);
            return product ? product._id : null;
        } catch (err) {
            return err.message;
        }
    }
}

export default ProductController;

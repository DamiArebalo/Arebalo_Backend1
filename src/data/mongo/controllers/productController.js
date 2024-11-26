
import { query } from 'express';
import ProductModel from '../models/productsModel.js';
import config from '../config.js';


class ProductController {
    constructor() {}

    get = async () => {
        try {
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

    add = async (data) => {
        try {
            return await ProductModel.create(data);
        } catch (err) {
            return err.message;
        }
    }

    update = async (filter, updated, options) => {
        try {
            return await ProductModel.findOneAndUpdate(filter, updated, options);
        } catch (err) {
            return err.message;
        }
    }

    delete = async (filter, options) => {
        try {
            return await ProductModel.findOneAndDelete(filter, options);
        } catch (err) {
            return err.message;
        }
    }

    stats = async (limit) => {
        try {
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

    getPaginated = async (query,options) => {
        try {
            const products = await ProductModel.paginate(query,options);
            return products;
        } catch (err) {
            return err.message;
        }
    }

    getByCode = async (code) => {
        try {
            const product = await ProductModel.findOne({ code: code }, '_id'); // Solo selecciona el campo _id
            console.log("intento de obtener producto: ",code ,product);
            return product ? product._id : null;
            
        } catch (err) {
            return err.message;
        }
    }
}


export default ProductController;

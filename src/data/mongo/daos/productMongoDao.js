import MongoDao from './mongoDao.js';
import ProductModel from '../models/productsModel.js';
import config from '../../../config.js';

import { query } from 'express';


class ProductMongoDao extends MongoDao {
    constructor() {
        super(ProductModel);
    }

    

    async getAll() {
        try {
            return await ProductModel.find()
                .populate({
                    path: 'category',
                    model: config.CATEGORIES_COLLECTION,
                    select: 'name'
                })
                .lean();
        } catch (error) {
            throw new Error(error);
        }
    }

    async getPaginated(query, options) {
        try {
            return await ProductModel.paginate(query, options);
        } catch (error) {
            throw new Error(error);
        }
    }

    async stats(limit) {
        try {
            const stats = await ProductModel.aggregate([
                { $match: { stock: limit } },
                { $group: { _id: '$title', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]);
            return stats;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getByCode(code) {
        try {
            const product = await ProductModel.findOne({ code: code }, '_id');
            return product ? product._id : null;
        } catch (error) {
            throw new Error(error);
        }
    }
}


export default ProductMongoDao;

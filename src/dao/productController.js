
import ProductModel from './models/productsModel.js';

class ProductController {
    constructor() {}

    get = async () => {
        try {
            const products = await ProductModel.find()
                .populate({
                    path: 'category',
                    model: 'categories',
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

    getPaginated = async (page) => {
        try {
            const products = await ProductModel.paginate({},{ limit: 5, page: page }).lean();
            return products;
        } catch (err) {
            return err.message;
        }
    }
}


export default ProductController;

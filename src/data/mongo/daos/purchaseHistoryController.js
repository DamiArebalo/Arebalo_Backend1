import MongoDao from './mongoDao.js';
import PurchaseHistoryModel from '../models/purchaseHistoryModel.js';

class PurchaseHistoryMongoDao extends MongoDao {
    constructor() {
        super(PurchaseHistoryModel);
    }

    async create(data) {
        try {
            const purchase = new PurchaseHistoryModel(data);
            await purchase.save();
            return purchase;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async getByUser(userId) {
        try {
            const purchases = await PurchaseHistoryModel.find({ user: userId });
            return purchases;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async getByState(state) {
        try {
            const purchases = await PurchaseHistoryModel.find({ state: state });
            return purchases;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async getByDate(date) {
        try {
            const purchases = await PurchaseHistoryModel.find({ date: date });
            return purchases;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async getById(id) {
        try {
            const purchase = await PurchaseHistoryModel.findById(id);
            return purchase;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async deleteByUser(userId) {
        try {
            const result = await PurchaseHistoryModel.deleteMany({ user: userId });
            return result;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async deleteById(id) {
        try {
            const result = await PurchaseHistoryModel.findByIdAndDelete(id);
            return result;
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

export default PurchaseHistoryMongoDao;

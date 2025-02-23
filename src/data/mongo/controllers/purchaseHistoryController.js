import PurchaseHistoryModel from '../models/purchaseHistoryModel.js';

class PurchaseHistoryController {
    constructor() {}

    // Método para crear un nuevo documento en el historial de compras
    create = async (data) => {
        try {
            const purchase = new PurchaseHistoryModel(data);
            await purchase.save();
            return purchase;
        } catch (err) {
            throw new Error(err.message);
        }
    };

    // Método para obtener todos los documentos de un usuario específico
    getByUser = async (userId) => {
        try {
            const purchases = await PurchaseHistoryModel.find({ user: userId });
            return purchases;
        } catch (err) {
            throw new Error(err.message);
        }
    };

    // Método para obtener todos los documentos con un estado específico
    getByState = async (state) => {
        try {
            const purchases = await PurchaseHistoryModel.find({ state: state });
            return purchases;
        } catch (err) {
            throw new Error(err.message);
        }
    };

    // Método para obtener todos los documentos en una fecha específica
    getByDate = async (date) => {
        try {
            const purchases = await PurchaseHistoryModel.find({ date: date });
            return purchases;
        } catch (err) {
            throw new Error(err.message);
        }
    };

    // Método para obtener un documento por su ID
    getById = async (id) => {
        try {
            const purchase = await PurchaseHistoryModel.findById(id);
            return purchase;
        } catch (err) {
            throw new Error(err.message);
        }
    };

    // Método para eliminar todos los documentos de un usuario específico
    deleteByUser = async (userId) => {
        try {
            const result = await PurchaseHistoryModel.deleteMany({ user: userId });
            return result;
        } catch (err) {
            throw new Error(err.message);
        }
    };

    // Método para eliminar un documento por su ID
    deleteById = async (id) => {
        try {
            const result = await PurchaseHistoryModel.findByIdAndDelete(id);
            return result;
        } catch (err) {
            throw new Error(err.message);
        }
    };
}

export default PurchaseHistoryController;

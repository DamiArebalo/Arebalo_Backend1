import mongoose from 'mongoose';
import config from '../../../config.js';

mongoose.pluralize(null); // Desactiva la pluralización automática de nombres de colección

const collection = config.PURCHASE_HISTORY_COLLECTION; // Nombre de la colección para el historial de compras

// Definición del esquema para el historial de compras
const schema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: config.PRODUCTS_COLLECTION, required: true },
        quantity: { type: Number, default: 1 },
        _id: false
    }],
    total: { type: Number, default: 0, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: config.USERS_COLLECTION, required: true, index: true },
    state: { type: String, enum: ['done', 'pending', 'canceled'], default: 'done' , index: true },
    date: { type: Date, default: Date.now, index: true }
}, {
    toJSON: { virtuals: true }, // Habilita la inclusión de virtuals en la salida JSON
});

// Middleware para calcular el total antes de guardar el documento
schema.pre('save', async function(next) {
    if (this.isModified('products')) {
        await this.populate('products.product'); // Popula los productos
        this.total = this.products.reduce((total, item) => {
            const price = item.product.offer !== 0 ? item.product.offer : item.product.priceList;
            return total + (price * item.quantity);
        }, 0);
    }
    next();
});

const PurchaseHistoryModel = mongoose.model(collection, schema); // Crea el modelo basado en el esquema

export default PurchaseHistoryModel; // Exporta el modelo

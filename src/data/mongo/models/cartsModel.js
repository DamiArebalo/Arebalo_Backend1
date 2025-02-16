import mongoose from 'mongoose';
import config from '../../../config.js';

mongoose.pluralize(null); // Desactiva la pluralización automática de nombres de colección

const collection = config.CARTS_COLLECTION; // Nombre de la colección para carritos

// Definición del esquema para los carritos
const schema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: config.PRODUCTS_COLLECTION, required: true },
        quantity: { type: Number, default: 1 },
        _id: false
    }],
    total: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: config.USERS_COLLECTION, required: true },
}, {
    toJSON: { virtuals: true }, // Habilita la inclusión de virtuals en la salida JSON
});

// Virtual para calcular el total del carrito
schema.virtual('calculatedTotal').get(function() {
    return this.products.reduce((total, item) => {
        const price = item.product.offer !== 0 ? item.product.offer : item.product.priceList;
        return total + (price * item.quantity);
    }, 0);
});

// Middleware para actualizar el total antes de guardar el documento
schema.pre('save', async function(next) {
    if (this.isModified('products')) {
        await this.populate('products.product'); // Popula los productos
        this.total = this.calculatedTotal; // Calcula y asigna el total
    }
    next();
});

// Middleware para actualizar el total después de findOneAndUpdate
schema.post('findOneAndUpdate', async function(doc) {
    if (doc) {
        await doc.populate('products.product'); // Popula los productos
        doc.total = doc.calculatedTotal; // Calcula y asigna el total
        await doc.save(); // Guarda el documento actualizado
    }
});

const CartModel = mongoose.model(collection, schema); // Crea el modelo basado en el esquema

export default CartModel; // Exporta el modelo

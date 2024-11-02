import mongoose from 'mongoose';
import config from '../../config.js';

mongoose.pluralize(null);

const collection = config.CARTS_COLLECTION;

const schema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: config.PRODUCTS_COLLECTION, required: true },
        quantity: { type: Number, default: 1 },
        _id: false
    }],
    total: { type: Number, default: 0 },
    
}, {
    toJSON: { virtuals: true },
});

// Virtual para calcular el total
schema.virtual('calculatedTotal').get(function() {
    return this.products.reduce((total, item) => {
        const price = item.product.offer !== 0 ? item.product.offer : item.product.priceList;
        return total + (price * item.quantity);
    }, 0);
});

// Middleware para actualizar el total antes de guardar
schema.pre('save', async function(next) {
    if (this.isModified('products')) {
        await this.populate('products.product');
        this.total = this.calculatedTotal;
    }
    next();
});

// Middleware para actualizar el total después de findOneAndUpdate
schema.post('findOneAndUpdate', async function(doc) {
    if (doc) {
        await doc.populate('products.product');
        doc.total = doc.calculatedTotal;
        await doc.save();
    }
});

const CartModel = mongoose.model(collection, schema);

export default CartModel;
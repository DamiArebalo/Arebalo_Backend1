import mongoose from 'mongoose';
import config from '../../config.js';

mongoose.pluralize(null);

const collection = config.CARTS_COLLECTION;

const schema = new mongoose.Schema({
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: config.PRODUCTS_COLLECTION,required: true }],
    qty: { type: Number, default: 1 }
});

const ProductModel = mongoose.model(collection, schema);

export default ProductModel;
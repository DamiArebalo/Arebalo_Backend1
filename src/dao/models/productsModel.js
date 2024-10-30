import mongoose from 'mongoose';
import config from '../../config.js';
import categoryModel from './categoriesModel.js';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoose.pluralize(null);
const collection = config.PRODUCTS_COLLECTION;

const schema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, index: true },
    priceList: { type: Number, required: true },
    description: { type: String },
    offer: { type: Number, default: 0, index: true },
    stock: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: config.CATEGORIES_COLLECTION, required: true, index: true },
    discount: { type: Number, default: 0 },
    status: { type: Boolean, default: true, index: true },
    thumbnails: { type: [String], default: [] } // Campo opcional para thumbnails
});
schema.plugin(mongoosePaginate);

const ProductModel = mongoose.model(collection, schema);
export default ProductModel
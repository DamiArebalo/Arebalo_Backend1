import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'products';

const schema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    priceList: { type: Number, required: true },
    description: { type: String },
    offer: { type: Number, default: 0 },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    discount: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
    thumbnails: { type: [String], default: [] }  // Campo opcional para thumbnails
});

const ProductModel = mongoose.model(collection, schema);

export default ProductModel;
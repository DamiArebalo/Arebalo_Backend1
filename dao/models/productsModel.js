import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'products';

const schema = new mongoose.Schema({
    product_id: { type: Number, required: true, unique: true },
    category_id: { type: Number, required: true },
    description: { type: String },
    product_name: { type: String, required: true },
    stock: { type: Number, required: true },
    list_price: { type: Number, required: true }
});

const ProductModel = mongoose.model(collection, schema);

export default ProductModel;
import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'categories';

const schema = new mongoose.Schema({
    category_id: { type: Number, required: true, unique: true },
    name: { type: String, required: true }
});

const CategoryModel = mongoose.model(collection, schema);

export default CategoryModel;

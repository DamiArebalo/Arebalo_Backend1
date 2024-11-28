import mongoose from 'mongoose';
import config from '../../../config.js';

mongoose.pluralize(null);

const collection = config.CATEGORIES_COLLECTION;

const schema = new mongoose.Schema({
    name: { type: String, required: true }
});

const CategoryModel = mongoose.model(collection, schema);

export default CategoryModel;

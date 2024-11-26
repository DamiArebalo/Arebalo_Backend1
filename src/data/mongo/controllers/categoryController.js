import CategoryModel from '../models/categoriesModel.js';

class CategoryController {
    constructor() {}

    findByName = async (name) => {
        try {
            const category = await CategoryModel.findOne({ name: name });
            return category;
        } catch (err) {
            throw new Error(err.message);
        }
    };
}

export default CategoryController;
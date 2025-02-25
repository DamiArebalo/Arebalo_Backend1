import MongoDao from './mongoDao.js';
import CategoryModel from '../models/categoriesModel.js';

class CategoryMongoDao extends MongoDao {
    constructor() {
        super(CategoryModel);
    }

    async findByName(name) {
        try {
            const category = await CategoryModel.findOne({ name: name });
            return category;
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

export default CategoryMongoDao;

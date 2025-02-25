import MongoDao from './mongoDao.js';
import User from '../models/user.model.js';

class UserMongoDao extends MongoDao {
    constructor() {
        super(User);
    }

    async create(data) {
        try {
            const one = await User.create(data);
            return one;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async readByEmail(email) {
        try {
            const one = await User.findOne({ email }).lean();
            return one;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async readById(id) {
        try {
            const one = await User.findOne({ _id: id }).lean();
            return one;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async read(data) {
        try {
            const all = await User.find(data).lean();
            return all;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async update(id, data) {
        try {
            const opt = { new: true };
            const one = await User.findByIdAndUpdate(id, data, opt);
            return one;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async destroy(id) {
        try {
            const one = await User.findByIdAndDelete(id);
            return one;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default UserMongoDao;

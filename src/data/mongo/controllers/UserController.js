import User from "../models/user.model.js";

class userController {

    constructor(){        
    }

    create = async (data) => {
        try {
            const one = await User.create(data)
            return one
        } catch (error) {
            throw error
        }
    }

    readByEmail = async (email) => {
        try {
            const one = await User.findOne({ email }).lean()
            return one
        } catch (error) {
            throw error
        }
    }

    readById = async (id) => {
        try {
            const one = await User.findOne({ _id: id }).lean()
            return one
        } catch (error) {
            throw error
        }
    }

    read = async (data) => {
        try {
            const all = await User.find(data).lean()
            return all
        } catch (error) {
            throw error
        }
    }

    update = async (id, data) => {
        try {
            const opt = { new: true }
            const one = await User.findByIdAndUpdate(id, data, opt)
            return one
        } catch (error) {
            throw error
        }
    }

    destroy = async (id) => {
        try {
            const one = await User.findByIdAndDelete(id)
            return one
        } catch (error) {
            throw error
        }
    }

}

export default userController
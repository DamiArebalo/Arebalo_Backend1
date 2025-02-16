import User from "../models/user.model.js";

// Controlador para manejar las operaciones relacionadas con los usuarios
class userController {

    constructor(){        
    }

    // Crear un nuevo usuario
    create = async (data) => {
        try {
            // Crea un nuevo usuario y lo retorna
            const one = await User.create(data);
            return one;
        } catch (error) {
            throw error;
        }
    }

    // Leer un usuario por su email
    readByEmail = async (email) => {
        try {
            // Encuentra un usuario por su email y retorna sus datos
            const one = await User.findOne({ email }).lean();
            return one;
        } catch (error) {
            throw error;
        }
    }

    // Leer un usuario por su ID
    readById = async (id) => {
        try {
            // Encuentra un usuario por su ID y retorna sus datos
            const one = await User.findOne({ _id: id }).lean();
            return one;
        } catch (error) {
            throw error;
        }
    }

    // Leer todos los usuarios que cumplan con ciertos criterios
    read = async (data) => {
        try {
            // Encuentra y retorna todos los usuarios que cumplan con los criterios
            const all = await User.find(data).lean();
            return all;
        } catch (error) {
            throw error;
        }
    }

    // Actualizar un usuario por su ID
    update = async (id, data) => {
        try {
            // Opciones para devolver el nuevo documento actualizado
            const opt = { new: true };
            // Encuentra un usuario por su ID y lo actualiza con los nuevos datos
            const one = await User.findByIdAndUpdate(id, data, opt);
            return one;
        } catch (error) {
            throw error;
        }
    }

    // Eliminar un usuario por su ID
    destroy = async (id) => {
        try {
            // Encuentra un usuario por su ID y lo elimina
            const one = await User.findByIdAndDelete(id);
            return one;
        } catch (error) {
            throw error;
        }
    }

}

export default userController;

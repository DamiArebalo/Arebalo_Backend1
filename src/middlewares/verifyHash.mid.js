import UserController from '../data/mongo/controllers/userController.js';
import { verifyHashUtil } from '../utils/hash.util.js';

const userController = new UserController();

// Middleware para verificar la contraseña
async function verifyHash(req, res, next) {
    // Obtener la contraseña del formulario y la de la base de datos
    const { password, email } = req.body;
    // Obtener el usuario por su email
    const user = await userController.readByEmail(email);
    // Verificar si la contraseña coincide con la almacenada
    const dbPassword = user.password;
    const verify = verifyHashUtil(password, dbPassword);

    //si la contraseña es correcta, pasar al siguiente middleware
    if (verify) {
        return next();
    } else {
        res.json401();
    }
}

export default verifyHash;
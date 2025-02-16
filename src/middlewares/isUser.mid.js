import UserController from "../data/mongo/controllers/userController.js";

// Middleware para verificar si el usuario ya existe
const userController = new UserController();

async function isUser(req, res, next) {

    // Obtener el email del usuario
    const { email } = req.body;
    // Verificar si el usuario ya existe
    const one = await userController.readByEmail(email);
   
    // Si el usuario ya existe, enviar un mensaje de error al cliente
    if (one) {
       res.json400("User already exists");
    }
    return next();

}

export default isUser;


import { createHashUtil } from '../utils/hash.util.js';

// Función para crear el hash de la contraseña
function createHash(req, res, next) {
    // Obtener la contraseña del formulario
    let { password } = req.body;
    // Crear el hash de la contraseña
    password = createHashUtil(password);
    // Agregar el hash a la contraseña del formulario
    req.body.password = password;

    return next();
}
// Exportar la función
export default createHash;
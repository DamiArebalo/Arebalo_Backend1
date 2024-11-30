import newError from '../utils/newError.js';
import { verifyHashUtil } from '../utils/hash.util.js';

function verifyHash(req, res, next) {

    const { password, passwordConfirmation } = req.body;
    if (!password || !passwordConfirmation) {
        newError("Faltan datos", 400);   
    }
    if (!verifyHashUtil(password, passwordConfirmation)) {
        newError("Las contraseñas no coinciden", 400);
    }
    return next();

}

export default verifyHash;
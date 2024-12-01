import { verifyHashUtil } from '../utils/hash.util.js';

function verifyHash(req, res, next) {

    const { password, passwordConfirmation } = req.body;
    if (!password || !passwordConfirmation) {
        res.json400("Faltan datos");
        
    }
    if (!verifyHashUtil(password, passwordConfirmation)) {
        res.json400("Las contraseñas no coinciden");
        
    }
    return next();

}

export default verifyHash;
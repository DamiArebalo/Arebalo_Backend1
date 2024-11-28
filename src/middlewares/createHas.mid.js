import newError from '../utils/newError.js';
import { createHashUtil } from '../utils/hash.util.js';

function createHash(req, res, next) {
    try {
        let { password } = req.body;
        password = createHashUtil(password);
        req.body.password = password;   
        return next();

        
    } catch (error) {
        newError("falta campo password", 400);
        
    }

    const hashPassword = createHash(password);
    req.body.password = hashPassword;
    next();
}
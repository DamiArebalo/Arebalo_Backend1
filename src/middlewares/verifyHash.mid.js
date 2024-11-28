import newError from '../utils/newError.js';
import { verifyHashUtil } from '../utils/hash.util.js';

function verifyHash(req, res, next) {
    try {
        const { password, passwordConfirmation } = req.body;
        if (!password || !passwordConfirmation) {
            return res.status(400).send({ error: 'Faltan datos' });
        }
    } catch (error) {
    next();
    }
}

export default verifyHash;
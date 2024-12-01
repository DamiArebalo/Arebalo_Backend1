import UserController from '../data/mongo/controllers/userController.js';
import { verifyHashUtil } from '../utils/hash.util.js';

const userController = new UserController();

async function verifyHash(req, res, next) {

    const { password, email } = req.body;
    const user = await userController.readByEmail(email);
    const dbPassword = user.password;
    const verify = verifyHashUtil(password, dbPassword);
    if (verify) {
        return next();
    } else {
        res.json401();
    }
}

export default verifyHash;
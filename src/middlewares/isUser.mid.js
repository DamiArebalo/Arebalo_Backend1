import UserController from "../data/mongo/controllers/userController.js";

const userController = new UserController();

async function isUser(req, res, next) {

    const { email } = req.body;
    const one = await userController.readByEmail(email);
    console.log(one);
    if (one) {
       res.json400("User already exists");
    }
    return next();

}

export default isUser;


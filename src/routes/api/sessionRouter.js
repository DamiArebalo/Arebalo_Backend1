import CustomRouter from "../../utils/customRouter.util.js";
import UserController from "../../data/mongo/controllers/userController.js";
import session from "express-session";
import isUser from "../../middlewares/isUser.mid.js";
import isValidUserData from "../../middlewares/isValidUserData.mid.js";
import { createHashUtil, verifyHashUtil } from "../../utils/hash.util.js";

class SessionApiRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.create("/register",isValidUserData,isUser, register)
        this.create("/login", login)
        this.create("/logout", logout)
    }
}

let sessionApiRouter = new SessionApiRouter();
sessionApiRouter = sessionApiRouter.getRouter();

export default sessionApiRouter

const userController = new UserController()


async function register(req, res,) {
    const { email, password } = req.body
    
    const passwordHash = createHashUtil(password);
    
    //middlewares
    const message = "user registered"

    const data = req.body
    data.password = passwordHash;

    const response = await userController.create(data)
    return res.json201({ response, message })

}
async function login(req, res) {
    //middlewares

    req.session.online = true;
    req.session.email = req.body.email;
    req.session.password = req.body.password;

    const message = "User Loged IN"
    const response = await userController.read()
    return res.json200({ response, message })

}

async function online(req, res) {
    const message = "User Online"
    const session = req.session
    if(req.session.online === true){
        return res.json200({ session, message })
    }   
    return res.json401()
}

async function logout(req, res) {
    session = req.session
    req.session.destroy();
    const message = "User Loged OUT"
    return res.json200({ session, message })
}
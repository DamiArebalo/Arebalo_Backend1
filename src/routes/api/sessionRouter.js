import CustomRouter from "../../utils/customRouter.util.js";

import session from "express-session";
import passportLocal from "../../middlewares/passport.mid.js";
import UserController from "../../data/mongo/controllers/userController.js";
import { createTokenUtil, finishTokenUtil, verifyTokenUtil } from "../../utils/token.util.js";
const userController = new UserController()

class SessionApiRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.create("/register",passportLocal.authenticate("register", {session: false}), register)
        this.create("/login",passportLocal.authenticate("login", {session: false}), login)
        this.create("/logout", logout)
    }
}

let sessionApiRouter = new SessionApiRouter();
sessionApiRouter = sessionApiRouter.getRouter();

export default sessionApiRouter




async function register(req, res,) {
    //middlewares
    const response = req.user
    const message = "user registered"
    return res.json201( response, message )

}
async function login(req, res) {

    const message = "User Loged IN"


    const response = req.token
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

async function onlineToken(req, res) {

    const message = "User Online"

    const verifydata = verifyTokenUtil(req.token)
    console.log(verifydata);

    const user = await userController.readById(verifydata._id)
    console.log(user.role);
    
    if(user){
        return res.json200({ user, message })
       
    }else{
        return res.json401()
    }
    
}
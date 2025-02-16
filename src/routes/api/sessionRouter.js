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
        this.create("/logout", logout)
        this.read("/current", dataOnline)
    }
}
let sessionApiRouter = new SessionApiRouter();
sessionApiRouter = sessionApiRouter.getRouter();

export default sessionApiRouter

//funcion para obtener datos del usuario en línea
async function dataOnline(req, res) {
    const message = "User Online"
    
    //recuperar el token
    const token = req.cookies.authToken;
    console.log("token: ", token);
    //verificar si existe el token
    const verifydata = verifyTokenUtil(token);
    console.log(verifydata);

    const user = await userController.readById(verifydata._id)

    const dataUser = {
        _id: user._id,
        role: user.role,
        isOnline: true,
        name: user.name,
    }
   

    if(user){
        return res.json200({ token, verifydata,dataUser, message })
       
    }   
    return res.json401()
}


//funcion para registrar un usuario
async function register(req, res,) {
    //middlewares
    const response = req.user
    const message = "user registered"
    return res.json201( response, message )

}

//funcion para iniciar sesión
async function login(req, res) {

    const message = "User Loged IN"


    const response = req.token
    return res.json200({ response, message })

}
//funcion para verificar si el usuario está en línea
async function online(req, res) {

    const message = "User Online"

    const session = req.session
    if(req.session.online === true){
        return res.json200({ session, message })
    }   
    return res.json401()
}

//funcion para cerrar sesión
async function logout(req, res) {
    session = req.session
    req.session.destroy();
    const message = "User Loged OUT"
    return res.json200({ session, message })
}

//funcion para verificar si el token es válido
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


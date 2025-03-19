import CustomRouter from "../../utils/customRouter.util.js";

import session from "express-session";

import userController from "../../controllers/userController.js";
import { createTokenUtil, finishTokenUtil, verifyTokenUtil } from "../../utils/token.util.js";

import UserDto from "../../dtos/userDto.js";
import validateUser from "../../middlewares/validateUser.mid.js";
import passport from '../../middlewares/passport.mid.js';


class SessionApiRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.create("/logout",validateUser, logout)
        this.read("/current",validateUser, dataOnline)
        this.create("/login", login)
        this.create("/register", register)
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

    const user = await userController.getById(verifydata._id)

    const dataUser = new UserDto(user);
   
    if(user){
        return res.json200({ dataUser})
       
    }   
    return res.json401()
}


// Función para manejar el inicio de sesión
async function login(req, res, next) {
    passport.authenticate('login', { session: false }, async (err, user, message) => {
        if (err || !user) {
            console.log("error: ", err);
            socketServer.emit('errorLogin', {
                err: err.message
            });
            return res.json401();
        }

        let token = req.token;
        console.log("token: ", token);

        if (token) {
            console.log("token guardado");
            res.cookie('authToken', token, { httpOnly: true, secure: true });
        }

        console.log("user loged: ", user);
        console.log("message loged: ", message);

        

        return res.json200({ message: "ok" });
    })(req, res, next);
}

// Función para manejar el registro de usuarios
async function register(req, res, next) {
    passport.authenticate('register', { session: false }, async (err, user, message) => {
        if (err || !user) {
            console.log("error: ", err);

            return res.json401();
        }

        console.log("user: ", user);
        console.log("message: ", message);

    })(req, res, next);
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

    const user = await userController.getById(verifydata._id)
    console.log(user.role);
    
    if(user){
        return res.json200({ user, message })
       
    }else{
        return res.json401()
    }
    
}


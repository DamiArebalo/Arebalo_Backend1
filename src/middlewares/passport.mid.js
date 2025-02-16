import passport from "passport"; 
import { Strategy as LocalStrategy } from "passport-local"; 
import UserController from "../data/mongo/controllers/userController.js"; 
import { createHashUtil, verifyHashUtil } from "../utils/hash.util.js"; 
import { createTokenUtil, finishTokenUtil, verifyTokenUtil } from "../utils/token.util.js"; 

const userController = new UserController(); // Instanciar el controlador de usuario

// Configurar Passport para manejar el registro de usuarios
passport.use(
    "register", // Nombre de la estrategia
    new LocalStrategy( 
        {
            passReqToCallback: true, // Pasar el objeto de solicitud al callback
            usernameField: "email", // Definir el campo de nombre de usuario como 'email'
        },
        async (req, email, password, done) => { // Callback que se ejecuta al intentar registrar un usuario
            try {
                // Verificar si el usuario ya existe en la base de datos
                const one = await userController.readByEmail(email);

                if (!email || !password) {
                    // no es nesesario definir
                }

                // Si el usuario ya existe, retornar un error
                if (one) {
                    const error = new Error("USER ALREADY EXISTS"); 
                    error.statusCode = 401; 
                    return done(error); 
                }else{
                    //puesto de control
                    //console.log("user no existe ✅");
                }

                // Crear el hash de la contraseña y reemplazarlo en el objeto de solicitud
                req.body.password = createHashUtil(password); // Utilizar la función de hash para encriptar la contraseña

                //puesto de control 
                console.log("contraseña hasheada")
                // Asignar un nombre por defecto si no se proporciona uno
                if (!req.body.name) {
                    req.body.name = "Default Name"; // Nombre por defecto
                }

                //REGISTRO DE ADMIN
                if(email === "adminCoder@coder.com"){
                    req.body.role = "ADMIN";
                }

                const data = req.body; // Obtener los datos del cuerpo de la solicitud
                
                //puesto de control
               // console.log("data del registro: ", data);

                const user = await userController.create(data); // Crear un nuevo usuario en la base de datos
                
                return done(null, user, { message: "Usuario creado" }); // Llamar a done sin error y pasar el usuario creado
               
            } catch (error) {
                return done(error); // En caso de error, llamar a done con el error
            }
        }
    )
);


passport.use(
    "login", // Nombre de la estrategia para iniciar sesión
    new LocalStrategy( 
        {
            passReqToCallback: true, 
            usernameField: "email" 
        },
        async (req, email, password, done) => { 
            try {
                // Buscar el usuario en la base de datos por su email
                const user = await userController.readByEmail(email);

                // si el usuario no existe retornar un error
                if (!user) {
                    const error = new Error("USER NOT FOUND"); 
                    error.statusCode = 401; 
                    return done(error); 
                }

                // Obtener la contraseña del formulario y la de la base de datos
                const passwordForm = password; /* req.body.password */
                const passwordDb = user.password;

                // Verificar si la contraseña proporcionada coincide con la almacenada
                const verify = verifyHashUtil(passwordForm, passwordDb);

                // Si la contraseña no coincide, retornar un error
                if (!verify) {
                    const error = new Error("INVALID CREDENTIALS"); 
                    error.statusCode = 401; 
                    return done(error); 
                }

                // Crear un objeto de datos que contiene el ID y el rol del usuario
                const data = {
                    _id: user._id, // ID del usuario
                    role: user.role // Rol del usuario
                }

                // Se comentan las líneas para manejar sesiones, ya que se está usando tokens
                // req.session.user_id = user._id;
                // req.session.role = user.role;

                // Crear un token JWT para el usuario
                req.token = createTokenUtil(data); // Generar un token usando los datos del usuario
                user.token = req.token; // Asignar el token al objeto del usuario

                //PUESTO DE CONTROL
               //console.log("user.token");

                // Actualizar el estado del usuario a 'en línea' en la base de datos
                await userController.update(user._id, { isOnline: true });
                return done(null, user, { message: "Usuario autenticado" }); // Llamar a done sin error y pasar el usuario autenticado
            } catch (error) {
                return done(error); // En caso de error, llamar a done con el error
            }
        }
    )
);

// configurar passport github
 


export default passport;
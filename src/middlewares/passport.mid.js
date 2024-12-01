import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import UserController from "../data/mongo/controllers/userController.js";
import { createHashUtil, verifyHashUtil } from "../utils/hash.util.js";


const userController = new UserController();
//los passport se utilizan para unfificar y simplififcar todos los middlewares
passport.use(
  "register",
  new LocalStrategy(
    {
      passReqToCallback: true,
      usernameField: "email",
    },
    async (req, email, password, done) => {
      try {
        const one = await userController.readByEmail(email);
        

        if(!email || !password){
            // no hace falta definirlo
        }

        //si el user ya existe -> error
        if (one) {
          const error = new Error("USER ALREADY EXISTS");
          error.statusCode = 401;
          return done(error);
        }
        
        // crear el hash de la contraseña y reemplaza en el req
        req.body.password = createHashUtil(password);

        //nombre por defecto
        if(!req.body.name){
            req.body.name = "Default Name";
        }

        const data = req.body;

        const user = await userController.create(data);
        return done(null, user);

      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    { 
        passReqToCallback: true,
        usernameField: "email"
    },
    async (req , email, password, done) => {
      try {
        const user = await userController.readByEmail(email);
        
        if (!user) {
          const error = new Error("USER NOT FOUND");
          error.statusCode = 401;
          return done(error);
        }

        const passwordForm = password; /* req.body.password */
        const passwordDb = user.password;

        const verify = verifyHashUtil(passwordForm, passwordDb);
        if (!verify) {
          const error = new Error("INVALID CREDENTIALS");
          error.statusCode = 401;
          return done(error);
        }

        req.session.user_id = user._id;
        req.session.role = user.role;

        // const token = createTokenUtil(data);
        // user.token = token;

        await userController.update(user._id, { isOnline: true });
        return done(null, user);
      } catch (error) {
            return done(error);
      }
    }
  )
);

export default passport;
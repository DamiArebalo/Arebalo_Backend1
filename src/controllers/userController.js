import Controllers from "./controllerManager.js";
import { userService } from '../services/userService.js';

class UserController extends Controllers {
  constructor(){
    super(userService)
  }
  readByEmail = async (email) => {
    try {
      const user = await this.service.readByEmail(email);
      return user;
    } catch (error) {
      throw error;
    }
  };
  
  
  privateData = (req, res) => {
    try {
      //se podria guardar el id en el generateToken
      //y en este controller llamar al this.service.getById()
      if (!req.user)
        throw new Error("No se puede acceder a los datos del usuario");
      res.json({
        user: req.user,
      });
    } catch (error) {
      throw error;
    }
  };
}


const userController = new UserController();

export  default userController;

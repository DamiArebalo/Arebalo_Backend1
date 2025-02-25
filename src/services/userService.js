import { createHashUtil, verifyHashUtil } from "../utils/hash.util.js";
import Services from "./servicesManager.js";
import persistance from "../data/factory.js";
const { userDao } = persistance;

import jwt from "jsonwebtoken";
import "dotenv/config";
import { cartService } from "./cartService.js";

class UserService extends Services {
  constructor() {
    super(userDao);
  }

  generateToken = (user) => {
    const payload = {
      // _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: user.cart
    };

    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "20m" });
  };

  getUserByEmail = async (email) => {
    try {
      return await this.dao.getByEmail(email);
    } catch (error) {
      throw new Error(error);
    }
  };

  register = async (user) => {
    try {
      const { email, password, isGithub } = user;
      const existUser = await this.getUserByEmail(email);
      if (existUser) throw new Error("User already exists");
      if (isGithub) {
        const newUser = await this.dao.register(user);
        return newUser;
      }
      const cartUser = await cartService.createCart();
      const newUser = await this.dao.register({
        ...user,
        password: createHashUtil(password),
        cart: cartUser._id
      });
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  login = async (user) => {
    try {
      const { email, password } = user;
      const userExist = await this.getUserByEmail(email);
      if (!userExist) throw new Error("User not found");
      const passValid = verifyHashUtil(password, userExist);
      if (!passValid) throw new Error("incorrect credentials");
      return this.generateToken(userExist);
    } catch (error) {
      throw error;
    }
  };
}

export const userService = new UserService();
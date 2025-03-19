import UserDto from "../dtos/userDto.js";
import { verifyTokenUtil } from "../utils/token.util.js";
import userController from "../controllers/userController.js";

export default async function validateUser(req, res, next) {
    const token = req.cookies.authToken;
    if (!token) {
        return res.json401();
    }
    const user = await getUserByToken(token);
    if (!user) {
        return res.json401();
    }
    req.user = new UserDto(user);
    next();
}

async function getUserByToken(token) {
    const verifydata = verifyTokenUtil(token);
    console.log("verifydata: ", verifydata);
    let id = verifydata._id;
    
    const user = await userController.getById(id);
    return user;
}
import CustomRouter from "../../utils/customRouter.util.js";
import UserController from "../../data/mongo/controllers/userController.js";

class UsersApiRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.create("/", createUser)
        this.read("/", readUsers)
        this.update("/:id", updateUser)
        this.destroy("/:id", destroyUser)
    }
}
let usersApiRouter = new UsersApiRouter();
usersApiRouter = usersApiRouter.getRouter();

export default usersApiRouter

const userController = new UserController()


async function createUser(req, res,) {

    const message = "USER CREATED"
    const data = req.body
    const response = await userController.create(data)
    return res.status(201).json({ response, message })

}
async function readUsers(req, res) {

    const message = "USERS FOUND"
    const response = await userController.read()
    return res.status(200).json({ response, message })

}
async function updateUser(req, res) {

    const { id } = req.params
    const data = req.body
    const message = "USER UPDATED"
    const response = await userController.update(id, data)
    return res.status(200).json({ response, message })

}
async function destroyUser(req, res) {

    const { id } = req.params
    const message = "USER DELETED"
    const response = await userController.destroy(id)
    return res.status(200).json({ response, message })

}
import CustomRouter from "../../utils/customRouter.util.js";
import userController from "../../controllers/userController.js";
import validateUser from "../../middlewares/validateUser.mid.js";
import validateAdmin from "../../middlewares/validateAdmin.mid.js";

// Define el enrutador para las operaciones de usuarios
class UsersApiRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }
    // Inicializa las rutas del enrutador
    init = () => {
        this.create("/",validateUser,validateAdmin, createUser); // Ruta para crear un usuario
        this.read("/",validateUser,validateAdmin, readUsers); // Ruta para leer usuarios
        this.update("/:id",validateUser, updateUser); // Ruta para actualizar un usuario
        this.destroy("/:id",validateUser, destroyUser); // Ruta para eliminar un usuario
    }
}

let usersApiRouter = new UsersApiRouter();
usersApiRouter = usersApiRouter.getRouter();

export default usersApiRouter;



// Función para crear un nuevo usuario
async function createUser(req, res) {
    const message = "USER CREATED";
    const data = req.body;
    const response = await userController.create(data);
    return res.status(201).json({ response, message });
}


// Función para leer todos los usuarios
async function readUsers(req, res) {
    const message = "USERS FOUND";
    const response = await userController.getAll();
    return res.status(200).json({ response, message });
}

// Función para actualizar un usuario
async function updateUser(req, res) {
    const { id } = req.params;
    const data = req.body;
    const message = "USER UPDATED";
    const response = await userController.update(id, data);
    return res.status(200).json({ response, message });
}

// Función para eliminar un usuario
async function destroyUser(req, res) {
    const { id } = req.params;
    const message = "USER DELETED";
    const response = await userController.delete(id);
    return res.status(200).json({ response, message });
}

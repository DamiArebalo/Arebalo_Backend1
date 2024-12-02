import CustomRouter from "../../utils/customRouter.util.js";
import productsRouter from "./productsRoutes.js";
import cartsRouter from "./cartsRouter.js";
import usersRouter from "./usersRouter.js";
import sessionRouter from "./sessionRouter.js";

class ApiRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.use("/users",["ADMIN, USER"], usersRouter);
        this.use("/products",["PUBLIC"], productsRouter);
        this.use("/carts",["PUBLIC"], cartsRouter);
        this.use("/session",["PUBLIC"], sessionRouter);
    }
}

let apiRouter = new ApiRouter();
apiRouter = apiRouter.getRouter();

export default apiRouter;
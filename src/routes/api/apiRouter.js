import CustomRouter from "../../utils/customRouter.util.js";
import productsRouter from "./productsRoutes.js";
import cartsRouter from "./cartsRouter.js";
import usersRouter from "./usersRouter.js";

class ApiRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.use("/users", usersRouter);
        this.use("/products", productsRouter);
        this.use("/carts", cartsRouter);
    }
}

let apiRouter = new ApiRouter();
apiRouter = apiRouter.getRouter();

export default apiRouter;
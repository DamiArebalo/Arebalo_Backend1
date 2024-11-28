import { Router } from "express";
import productsRouter from "./productsRoutes.js";
import cartsRouter from "./cartsRouter.js";

const apiRouter = Router();

apiRouter.use("/products", productsRouter);
apiRouter.use("/carts", cartsRouter);

export default apiRouter;
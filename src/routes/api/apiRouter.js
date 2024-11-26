import { Router } from "express";
import productsRouter from "./productsRoutes.js";

const apiRouter = Router();

apiRouter.use("/products", productsRouter);

export default apiRouter;
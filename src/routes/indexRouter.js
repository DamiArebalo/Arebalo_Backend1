import { Router } from "express";
import apiRouter from "./api/apiRouter.js";

const apiRouter = Router();

apiRouter.use("/api", apiRouter);
apiRouter.use("/", viewsRouter)

export default indexRouter;
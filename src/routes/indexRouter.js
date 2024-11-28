import express from 'express';
import { Router } from "express";
import apiRouter from "./api/apiRouter.js";
import viewsRouter from "./views/viewsRouter.js";
import config from '../config.js';


const indexRouter = Router();

indexRouter.use("/api", apiRouter);
indexRouter.use("/views", viewsRouter)
indexRouter.use('/static', express.static(`${config.DIRNAME}/public`));

export default indexRouter;
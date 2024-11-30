import express from 'express';
import CustomRouter from '../utils/customRouter.util.js';

import apiRouter from "./api/apiRouter.js";
import viewsRouter from "./views/viewsRouter.js";
import config from '../config.js';

class IndexRouter extends CustomRouter {

    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.use("/api", apiRouter);
        this.use("/views", viewsRouter)
        this.use('/static', express.static(`${config.DIRNAME}/public`));
    }
}

let indexRouter = new IndexRouter();
indexRouter = indexRouter.getRouter();
export default indexRouter;
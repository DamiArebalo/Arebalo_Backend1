import CustomRouter from "../../utils/customRouter.util.js";

import productsRouter from "./productsView.js";
import cartsRouter from "./cartsView.js";



class ViewsIndexRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.use("/products", productsRouter);
        this.use("/carts", cartsRouter);
    }
}

let router = new ViewsIndexRouter();
router = router.getRouter();

export default router;

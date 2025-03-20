import CustomRouter from "../../utils/customRouter.util.js";

import productsRouter from "./productsView.js";
import cartsRouter from "./cartsView.js";
import homeRouter from "./homeview.js";
import validateUser from "../../middlewares/validateUser.mid.js";



class ViewsIndexRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.use("/products",validateUser, productsRouter);
        this.use("/carts", cartsRouter);
        this.use("/home", homeRouter);

    }
}

let router = new ViewsIndexRouter();
router = router.getRouter();

export default router;

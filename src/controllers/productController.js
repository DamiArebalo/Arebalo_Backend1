import { prodService } from "../services/productService.js";
import Controllers from "./controllerManager.js";

class ProductController extends Controllers{
    constructor(){
        super(prodService)
    }
}

export const productController = new ProductController();
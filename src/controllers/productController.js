import  prodService from "../services/productService.js";
import Controllers from "./controllerManager.js";


class ProductController extends Controllers{
    constructor(){
        super(prodService)
    }

    async getAll() {
      try {
        return await this.service.getAll();
      } catch (error) {
        throw error;
      }
    }

    async getByCode(code) {
      try {
        return await this.service.getByCode(code);
      } catch (error) {
        throw error;
      }
    }   

    async getById(id) {
      try {
        return await this.service.getById(id);
      } catch (error) {
        throw error;
      }
    }

     async getPaginated(query, options) {
      try {
        return await this.service.getPaginated(query, options);
      } catch (error) {
        throw error;
      }
    }

    
}

const productController = new ProductController();

export default  productController;
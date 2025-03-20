import  prodService from "../services/productService.js";
import Controllers from "./controllerManager.js";


class ProductController extends Controllers{
    constructor(){
        super(prodService)
    }

    async getAllProducts() {
      try {
        return await this.service.getAllProducts();
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

    async getPaginated(query, options) {
      try {
        return await this.service.getPaginated(query, options);
      } catch (error) {
        throw error;
      }
    }

    async updateStock(productId, quantity) {
      try {
        return await this.service.updateStock(productId, quantity);
      } catch (error) {
        throw error;
      }
    }

    async groupByStock(limit) {
        try {
            return await this.service.groupByStock(limit);
        } catch (error) {
            throw error;
        }
    }

    async getByFilter(filter) {
        try {
            return await this.service.getbyFilter(filter);
        } catch (error) {
            throw error;
        }   
    }
    
}

const productController = new ProductController();

export default  productController;
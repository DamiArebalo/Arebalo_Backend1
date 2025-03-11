import {Services} from "./servicesManager.js";
import daos  from "../data/factory.js";
  
class ProductService extends Services {
    constructor(){
        super(daos.daos.prodDao);
        console.log("dao", daos.daos.prodDao);
        
    }

  
    async getByCode(code) {
      try {
        return await this.dao.getByCode(code);
      } catch (error) {
        throw error;
      }
    }

    async getPaginated(query, options) {
      try {
        return await this.dao.getPaginated(query, options);
      } catch (error) {
        throw error;
      }
    }
    //async stats(limit) {
    //  try {
    //    return await this.dao.stats(limit);
    //  } catch (error) {
    //    throw error;
    //  }
    //}     


}

const prodService = new ProductService();

export default prodService;
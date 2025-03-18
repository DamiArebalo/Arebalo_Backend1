import Controllers from "./controllerManager.js";
import  purchaseHistoryService  from '../services/purchaseHistoryService.js';

class PurchaseHistoryController extends Controllers {
  constructor(){
    super(purchaseHistoryService)
  }

  
  getByUser = async (user_id) => {
    try {
      return await this.service.getByUser(user_id);
    } catch (error) {
      throw error;
    }
  };

  getByState = async (state) => {
    try {
      return await this.service.getByState(state);
    } catch (error) {
      throw error;
    }
  };

  getByDate = async (date) => {
    try {
      return await this.service.getByDate(date);
    } catch (error) {
      throw error;
    }
  };


  deleteByUser = async (user_id) => {
    try {
      return await this.service.deleteByUser(user_id);

    } catch (error) {
      throw error;
    }
  };

  deleteById = async (id) => {
    try {
      
      return await this.service.deleteById(id);
      
    } catch (error) {
      throw error;
    }
  };
}

const purchaseHistoryController = new PurchaseHistoryController();

export default purchaseHistoryController;
import Controllers from "./controllerManager.js";
import  purchaseHistoryService  from '../services/purchaseHistoryService.js';

class PurchaseHistoryController extends Controllers {
  constructor(){
    super(purchaseHistoryService)
  }

  create = async (req, res) => {
    try {
      const response = await this.service.create(req.body);
      res.json(response);
    } catch (error) {
      throw error;
    }
  };

  getByUser = async (req, res) => {
    try {
      const { user_id } = req.params;
      const response = await this.service.getByUser(user_id);
      res.json(response);
    } catch (error) {
      throw error;
    }
  };

  getByState = async (req, res) => {
    try {
      const { state } = req.params;
      const response = await this.service.getByState(state);
      res.json(response);
    } catch (error) {
      throw error;
    }
  };

  getByDate = async (req, res) => {
    try {
      const { date } = req.params;
      const response = await this.service.getByDate(date);
      res.json(response);
    } catch (error) {
      throw error;
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const response = await this.service.getById(id);
      res.json(response);
    } catch (error) {
     throw error;
    }
  };

  deleteByUser = async (req, res) => {
    try {
      const { user_id } = req.params;
      const response = await this.service.deleteByUser(user_id);
      res.json(response);
    } catch (error) {
      throw error;
    }
  };

  deleteById = async (req, res) => {
    try {
      const { id } = req.params;
      const response = await this.service.deleteById(id);
      res.json(response);
    } catch (error) {
      throw error;
    }
  };
}

const purchaseHistoryController = new PurchaseHistoryController();

export default purchaseHistoryController;
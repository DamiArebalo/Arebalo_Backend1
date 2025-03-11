import {Services} from "./servicesManager.js";
import daos  from "../data/factory.js";


class PurchaseHistoryService extends Services {
  constructor() {
    super(daos.daos.purchaseHistoryDao);
  }

  create = async (data) => {
    try {
      return await this.dao.create(data);
    } catch (error) {
      throw error;
    }
  };

  getByUser = async (userId) => {
    try {
      return await this.dao.getByUser(userId);
    } catch (error) {
      throw error;
    }
  };

  getByState = async (state) => {
    try {
      return await this.dao.getByState(state);
    } catch (error) {
      throw error;
    }
  };

  getByDate = async (date) => {
    try {
      return await this.dao.getByDate(date);
    } catch (error) {
      throw error;
    }
  };

  getById = async (id) => {
    try {
      return await this.dao.getById(id);
    } catch (error) {
      throw error;
    }
  };

  deleteByUser = async (userId) => {
    try {
      return await this.dao.deleteByUser(userId);
    } catch (error) {
      throw error;
    }
  };

  deleteById = async (id) => {
    try {
      return await this.dao.deleteById(id);
    } catch (error) {
      throw error;
    }
  };
}
const purchaseHistoryService = new PurchaseHistoryService();

export  default purchaseHistoryService;
import {Services} from "./servicesManager.js";
import daos  from "../data/factory.js";


class CategoryService extends Services {
  constructor() {
    super(daos.daos.categoryDao);
  }

  getAll = async () => {
    try {
      return await this.dao.getAll();
    } catch (error) {
      throw error;
    }
  };

  getByName = async (name) => {
    try {
      return await this.dao.getByName(name);
    } catch (error) {
      throw error;
    }
  };
}

const categoryService = new CategoryService();

export default categoryService;
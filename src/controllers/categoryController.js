import  categoryService  from "../services/categoryService.js";
import Controllers from "./controllerManager.js";

class CategoryController extends Controllers {
  constructor() {
    super(categoryService);
  }
  getAll = async (req, res) => {
    try {
      const response = await this.service.getAll();
      res.json(response);
    } catch (error) {
      res.josn(error)
    }
  };

  getByName = async (name) => {
    try {
      return await this.service.getByName(name);
      
    } catch (error) {
      throw error;
    }
  };
}

const categoryController = new CategoryController();

export default categoryController;
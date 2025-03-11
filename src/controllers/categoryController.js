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

  getByName = async (req, res) => {
    try {
      const { name } = req.params;
      const response = await this.service.getByName(name);
      res.json(response);
    } catch (error) {
      res.josn(error)
    }
  };
}

const categoryController = new CategoryController();

export default categoryController;
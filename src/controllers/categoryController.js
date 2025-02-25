import { categoryService } from "../services/categoryService.js";
import Controllers from "./controllerManager.js";

class CategoryController extends Controllers {
  constructor() {
    super(categoryService);
  }
  getAll = async (req, res, next) => {
    try {
      const response = await this.service.getAll();
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getByName = async (req, res, next) => {
    try {
      const { name } = req.params;
      const response = await this.service.getByName(name);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}

export const categoryController = new CategoryController();
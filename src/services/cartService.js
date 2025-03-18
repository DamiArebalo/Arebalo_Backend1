import {Services} from "./servicesManager.js";
import daos  from "../data/factory.js";

class CartServices extends Services {
  constructor() {
    super(daos.cartDao);
    
  }

  createCart = async() =>{
    try {
      return await this.dao.create();
    } catch (error) {
      throw error;
    }
  }

  addProdToCart = async (cartId, prodId) => {
    try {
      return await this.dao.addProdToCart(cartId, prodId);
    } catch (error) {
      throw (error);
    }
  };

  removeProduct = async (cartId, prodId) => {
    try {
      return await this.dao.removeProduct(cartId, prodId);
    } catch (error) {
      throw (error);
    }
  };

  updateProdQuantityToCart = async (cartId, prodId, quantity) => {
    try {
      return await this.dao.updateProdQuantityToCart(cartId, prodId, quantity);
    } catch (error) {
      throw (error);
    }
  };

  clearCart = async (cartId) => {
    try {
      return await this.dao.clearCart(cartId);
    } catch (error) {
      throw (error);
    }
  };

  findProductExist = async (cartId, productId) => {
    try {
      return await this.dao.findProductExist(cartId, productId);
    } catch (error) {
      throw (error);
    }
  };

  addProduct = async (cartId, productId, quantity) => {
    try {
      return await this.dao.addProduct(cartId, productId, quantity);
    } catch (error) {
      throw (error);
    }
  };

  removeAllProducts = async (cartId) => {
    try {
      return await this.dao.removeAllProducts(cartId);
    } catch (error) {
      throw (error);
    }
  };

  addProducts = async (cartId, products) => {
    try {
      return await this.dao.addProducts(cartId, products);
    } catch (error) {
      throw (error);
    }
  };
}

const cartService = new CartServices();

export default cartService;
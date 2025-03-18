import  cartService  from "../services/cartService.js";
import Controllers from "./controllerManager.js";

class CartController extends Controllers{
    constructor(){
        super(cartService)
    }

    create = async (data) => {
      try {
        const response = await this.service.create(data);
        return response;
      } catch (error) {
        throw error;
      }
    };

    addProduct = async (cartId, productId, quantity) => {
      try {
        const response = await this.service.addProduct(cartId, productId, quantity);
        return response;
      } catch (error) {
        throw error;
      }
    };

    removeProduct = async (cartId, productId ) => {
      try {
        const response = await this.service.removeProduct(cartId, productId);
        return response;
      } catch (error) {
        throw error;
      }
    };

    updateProdQuantityToCart = async (cartId, productId, quantity) => {
      try {
        const response = await this.service.updateProdQuantityToCart(cartId, productId, quantity);
        return response;
      } catch (error) {
        throw error;
      }
    };

    clearCart = async (cartId) => {
      try {
        const response = await this.service.clearCart(cartId);
        return response;
      } catch (error) {
        throw error;
      }
    };

    findProductExist = async (cartId, productId) => {
      try {
        const response = await this.service.findProductExist(cartId, productId);
        return response;
      } catch (error) {
        throw error;
      }
    };

    removeAllProducts = async (cartId) => {
      try {
        const response = await this.service.removeAllProducts(cartId);
        return response;
      } catch (error) {
        throw error;
      }
    };

    addProducts = async (cartId, products) => {
      try {
        const response = await this.service.addProducts(cartId, products);
        return response;
      } catch (error) {
        throw error;
      }
    };
}
const cartController = new CartController();

export  default cartController;
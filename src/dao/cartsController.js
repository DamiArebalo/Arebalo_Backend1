//cartsController.js
import CartModel from './models/cartsModel.js';


class CartController {
    constructor() {}

    get = async () => {
        try {
            return await CartModel.find().lean().populate('products');
        } catch (err) {
            return err.message;
        }
    }

     add = async (data) => {
        try {
            return await CartModel.create(data);
        } catch (err) {
            return err.message;
        }
    }

      update = async (filter, updated, options) => {
        try {
            return await CartModel.findOneAndUpdate(filter, updated, options);
        } catch (err) {
            return err.message;
        }
    }

       delete = async (filter, options) => {
        try {
            return await CartModel.findOneAndDelete(filter, options);
        } catch (err) {
            return err.message;
        }
    }

}    

export default CartController;
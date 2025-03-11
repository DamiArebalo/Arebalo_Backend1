import initMongoDB from "./mongo/mongoDB.js";
import ProductMongoDao from "./mongo/daos/productMongoDao.js";
import UserMongoDao from "./mongo/daos/userMongoDao.js";
import cartMongoDao from "./mongo/daos/cartsMongoDao.js";
import CategoryMongoDao from "./mongo/daos/categoryMongoDao.js";
import PurchaseHistoryMongoDao from "./mongo/daos/purchaseHistoryController.js";

import { mongo } from "mongoose";

let persitance = mongo;

let daos, prodDao , userDao , cartDao , categoryDao, purchaseHistoryDao;

switch (persitance) {
    case 'mongo':
        prodDao = new ProductMongoDao();
        userDao = new UserMongoDao();
        cartDao = new cartMongoDao();
        categoryDao = new CategoryMongoDao();
        purchaseHistoryDao = new PurchaseHistoryMongoDao();
        initMongoDB();
        break;
    case 'file':
        
        initFileDB();
        break;
    default:
        initMongoDB();
        
        prodDao = new ProductMongoDao();
        userDao = new UserMongoDao();
        cartDao = new cartMongoDao();
        categoryDao = new CategoryMongoDao();
        purchaseHistoryDao = new PurchaseHistoryMongoDao();
        daos = {
            prodDao,
            userDao,
            cartDao,
            categoryDao,
            purchaseHistoryDao
        }
        console.log("inited to default MongoDB");
        break;
}

export default {persitance, daos};
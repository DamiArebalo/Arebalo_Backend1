
import * as url from 'url'


const config = {
    PORT: process.env.PORT,
    DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    MONGODB_URI: process.env.MONGODB_URI,
    PRODUCTS_COLLECTION: 'products',
    CATEGORIES_COLLECTION: 'categories',
    CARTS_COLLECTION: 'carts',
    USERS_COLLECTION: 'users',
    PURCHASE_HISTORY_COLLECTION: 'purchaseHistory',

};


export default config;
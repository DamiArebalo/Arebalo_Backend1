
import * as url from 'url'


const config = {
    PORT: process.env.PORT,
    DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    MONGODB_URI: process.env.MONGODB_URI,
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/uploads` },
    PRODUCTS_COLLECTION: 'products',
    CATEGORIES_COLLECTION: 'categories',
    CARTS_COLLECTION: 'carts'

};


export default config;
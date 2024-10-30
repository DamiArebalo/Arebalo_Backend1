
import * as url from 'url'


const config = {
    PORT: 8080,
    DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    MONGODB_URI: 'mongodb+srv://damiiarebalo:admin123@arebalobackend.qyz6l.mongodb.net/rityjust',
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/uploads` },
    PRODUCTS_COLLECTION: 'products',
    CATEGORIES_COLLECTION: 'categories',
    CARTS_COLLECTION: 'carts'

};


export default config;
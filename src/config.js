/**
 * Archivo central de configuración
 * 
 * Nos servirá para almacenar distintas constantes que podremos importar en cualquier
 * lugar del proyecto donde las necesitemos.
 */

import * as url from 'url';


const config = {
    PORT: 8080,
    DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    MONGODB_URI: 'mongodb+srv://damiiarebalo:admin123@arebalobackend.qyz6l.mongodb.net/rityjust',
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/uploads` }
};


export default config;
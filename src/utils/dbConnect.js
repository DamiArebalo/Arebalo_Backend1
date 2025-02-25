import { connect } from "mongoose";

class ConnectMongoDB {
    static #instance = null;
    constructor() {
        dbConnect();
    }
    static getInstance() {
        if (!this.#instance) {
            this.#instance = new ConnectMongoDB();
            console.log("ConnectMongoDB instance created");
        }else{
            console.log("ConnectMongoDB instance already created");
            return this.#instance;
        }
        
    }
}



async function dbConnect() {

    try {
        await connect(process.env.MONGODB_URI);
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.error("Error al conectar a MongoDB");
        console.error(error);
    }
}

export default  ConnectMongoDB;
import { connect } from "mongoose";

async function dbConnect() {
    try {
        await connect(process.env.MONGODB_URI);
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.error("Error al conectar a MongoDB");
        console.error(error);
    }
}

export default dbConnect;
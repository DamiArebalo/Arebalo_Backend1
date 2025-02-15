import { model, Schema } from "mongoose";
import config from "../../../config.js";

const collection = "users"

const schema = new Schema({
    name: { type: String },
    email: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    age: {type: Number},
    role: { type: String, default: 'USER', enum: ['USER','ADMIN','PREM'] },
    cart: {type: Schema.Types.ObjectId, ref:config.CARTS_COLLECTION, }
})

const User = model(collection, schema)
export default User
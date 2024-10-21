import mongoose from 'mongoose';

// Anulamos comportamiento de renombre por defecto de colecciones
mongoose.pluralize(null);

const collection = 'users';

const schema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true }
});

const model = mongoose.model(collection, schema);

export default model;

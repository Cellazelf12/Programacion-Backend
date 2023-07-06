import mongoose from 'mongoose'

const collection = 'users'

const schema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    password: String,
    role: String
})

const userModel = mongoose.model(collection, schema);
export default userModel;
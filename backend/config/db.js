import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://fukrainsaan0707:resume123@cluster0.mlha9ew.mongodb.net/RESUME')
    .then(() => console.log('MongoDB connected successfully'))
}
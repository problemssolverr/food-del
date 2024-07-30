import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_DB_KEY).then(() => console.log("DB Connected"));
}
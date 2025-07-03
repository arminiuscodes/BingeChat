import mongoose from 'mongoose'
export const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("database is connected successfully!")
    } catch (error) {
        console.error(`Error :${error.message}`);
        process.exit(1);
    }
}
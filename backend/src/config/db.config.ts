import ENV from "@src/common/ENV"
import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect(ENV.MongodbUri);
        console.info("Connected to MongoDB successfully.")
    } catch (error) {
        console.error("Couldn't connect to MongoDB!\nExtra details: " + error?.message)
    }
}
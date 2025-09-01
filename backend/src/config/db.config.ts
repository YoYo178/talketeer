import ENV from "@src/common/ENV"
import { Room, User } from "@src/models";
import mongoose from "mongoose"

async function clearStaleData() {
    try {
        console.info('Attempting to clear stale data from the database...')

        // Clear all members in all rooms
        await Room.updateMany({}, { $set: { members: [] } });

        // Clear users' room references
        await User.updateMany({}, { $unset: { room: '' } });

        console.info('Cleared stale data from the database.')
    } catch (e) {
        console.error('An error occured while attempting to clear stale data.')
        console.error(e?.message || e)
    }
}

export const connectDB = async () => {
    try {
        await mongoose.connect(ENV.MongodbUri);
        console.info("Connected to MongoDB successfully.")
        clearStaleData();
    } catch (error) {
        console.error("Couldn't connect to MongoDB!\nExtra details: " + error?.message)
    }
}
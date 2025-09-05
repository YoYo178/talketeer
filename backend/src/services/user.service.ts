import { User } from "@src/models";
import { IUser } from "@src/types";

export async function getAllUsers(filter = {}): Promise<IUser[]> {
    return User.find(filter).select("-passwordHash").lean().exec();
}

export async function getUser(userId: string): Promise<IUser | null> {
    return User.findById(userId).select("-passwordHash").lean().exec();
}

export async function getUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).select("-passwordHash").lean().exec();
}

export async function createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = await User.create(userData);
    return user.toObject();
}

export async function updateUser(userId: string, newUserData: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(
        userId,
        { $set: newUserData },
        { new: true, lean: true, select: "-passwordHash" }
    ).exec();
}

export async function deleteUser(userId: string): Promise<IUser | null> {
    return User.findByIdAndDelete(userId).lean().exec();
}

export async function isUserInRoom(userId: string, roomId: string): Promise<boolean> {
    const user = await User.findOne({ _id: userId, room: roomId })
        .select("_id")
        .lean()
        .exec();
    return !!user;
}

export async function updateUserRoom(userId: string, roomId: string | null) {
    return User.findByIdAndUpdate(
        userId,
        { $set: { room: roomId } },
        { new: true, lean: true, select: "-passwordHash" }
    ).exec();
}
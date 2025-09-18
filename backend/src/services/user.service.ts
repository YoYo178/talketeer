import { User } from "@src/models";
import { IUser, IUserFriend } from "@src/types";
import mongoose from "mongoose";

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

export async function updateUserRoom(userId: string, roomId: string | null) {
    return User.findByIdAndUpdate(
        userId,
        { $set: { room: roomId } },
        { new: true, lean: true, select: "-passwordHash" }
    ).exec();
}

export async function sendUserFriendRequest(senderId: string, receiverId: string) {
    const senderFriendObj: IUserFriend = {
        direction: 'outgoing',
        status: 'pending',
        userId: new mongoose.Types.ObjectId(receiverId)
    };

    const receiverFriendObj: IUserFriend = {
        direction: 'incoming',
        status: 'pending',
        userId: new mongoose.Types.ObjectId(senderId)
    };

    await User.findOneAndUpdate(
        { _id: senderId },
        {
            $addToSet: {
                friends: senderFriendObj
            }
        }
    )

    await User.findOneAndUpdate(
        { _id: receiverId },
        {
            $addToSet: {
                friends: receiverFriendObj
            }
        }
    )
}

export async function acceptUserFriendRequest(senderId: string, receiverId: string) {
    await User.findOneAndUpdate(
        { _id: senderId, 'friends.userId': receiverId },
        { $set: { 'friends.$.status': 'confirmed' } }
    )

    await User.findOneAndUpdate(
        { _id: receiverId, 'friends.userId': senderId },
        { $set: { 'friends.$.status': 'confirmed' } }
    )
}
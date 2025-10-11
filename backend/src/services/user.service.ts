import { User } from '@src/models';
import { IUser, IUserFriend } from '@src/types';
import mongoose from 'mongoose';

const publicUserFields = `
    -passwordHash
    -name
    -email
    -friends
    -notifications
    -room
    -updatedAt
    -isVerified
    -verifiedAt
`

export async function getAllUsers(filter = {}, publicUser?: boolean): Promise<IUser[]> {
    return User.find(filter).select(publicUser ? publicUserFields : '-passwordHash').lean().exec();
}

export async function getUser(userId: string, publicUser?: boolean): Promise<IUser | null> {
    return User.findById(userId).select(publicUser ? publicUserFields : '-passwordHash').lean().exec();
}

export async function getUserByEmail(email: string, publicUser?: boolean): Promise<IUser | null> {
    return User.findOne({ email }).select(publicUser ? publicUserFields : '-passwordHash').lean().exec();
}

export async function createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = await User.create(userData);
    return user.toObject();
}

export async function updateUser(userId: string, newUserData: Partial<IUser>, publicUser?: boolean): Promise<IUser | null> {
    return User.findByIdAndUpdate(
        userId,
        { $set: newUserData },
        { new: true, lean: true, select: publicUser ? publicUserFields : '-passwordHash' }
    ).exec();
}

export async function deleteUser(userId: string): Promise<IUser | null> {
    return User.findByIdAndDelete(userId).lean().exec();
}

export async function updateUserRoom(userId: string, roomId: string | null, publicUser?: boolean) {
    return User.findByIdAndUpdate(
        userId,
        { $set: { room: roomId } },
        { new: true, lean: true, select: publicUser ? publicUserFields : '-passwordHash' }
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

export async function removeFriendObject(userOneId: string, userTwoId: string) {
    await User.findOneAndUpdate(
        { _id: userOneId },
        { $pull: { friends: { userId: userTwoId } } }
    )

    await User.findOneAndUpdate(
        { _id: userTwoId },
        { $pull: { friends: { userId: userOneId } } }
    )
}
import { IUser, IUserFriend } from "@src/types";
import { MongooseModel } from "@src/utils";
import mongoose from "mongoose";

const userFriendSchema = new mongoose.Schema<IUserFriend>({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: { type: String, enum: ['confirmed', 'pending'] },
    direction: { type: mongoose.Schema.Types.Mixed, enum: ['incoming', 'outgoing', null] }
}, { _id: false });

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    displayName: { type: String, required: true },
    username: { type: String, required: true },

    email: { type: String, required: true },

    passwordHash: { type: String, required: true },

    bio: { type: String, required: false, default: '' },
    avatarURL: { type: String, required: false, default: '' },

    friends: { type: [userFriendSchema], required: false, default: [] },
}, { timestamps: true })

export const User = MongooseModel<IUser>('User', userSchema)
import { IUser, IUserFriend } from "@src/types";
import mongoose from "mongoose";

const userFriendSchema = new mongoose.Schema<IUserFriend>({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: { type: String, enum: ['confirmed', 'pending'] },
    direction: { type: mongoose.Schema.Types.Mixed, enum: ['incoming', 'outgoing', null] }
}, { _id: false });

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    displayName: { type: String, required: false },
    username: { type: String, required: true },

    email: { type: String, required: true },

    passwordHash: { type: String, required: true },

    role: { type: String, required: false, enum: ['admin', 'user'], default: 'user' },

    bio: { type: String, required: false, default: '' },
    avatarURL: { type: String, required: false, default: '' },

    friends: { type: [userFriendSchema], required: false, default: [] },
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification', required: true }],

    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },

    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date, default: Date.now }
}, { timestamps: true })

// Set the dynamic avatar URL for each user if not set already
//
// This could've been done using the 'default' property in the schema as well
// but in order to get the document ID, we need this pre-save function
userSchema.pre('save', function (next) {

    if (!this.avatarURL?.length)
        this.avatarURL = `assets/users/${this._id}/avatar.jpeg`

    next();
})

export const User = mongoose.model<IUser>('User', userSchema)
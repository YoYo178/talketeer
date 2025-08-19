import { IRoom, IRoomMember } from "@src/types";
import { MongooseModel } from "@src/utils";
import mongoose from "mongoose";

const roomMemberSchema = new mongoose.Schema<IRoomMember>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roomRole: { type: String, enum: ['admin', 'member'] },
    joinTimestamp: { type: Number, required: true }
}, { _id: false });

const roomSchema = new mongoose.Schema<IRoom>({
    name: { type: String, required: true },
    code: { type: String, required: true },
    currentMemberCount: { type: Number, required: false, default: 0 },
    memberLimit: { type: Number, required: false, default: 10 },
    members: { type: [roomMemberSchema], required: false, default: [] },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true }],
    isSystemGenerated: { type: Boolean, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true })

export const Room = MongooseModel<IRoom>('Room', roomSchema)
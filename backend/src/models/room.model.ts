import { IRoom, IRoomMember } from "@src/types";
import { MongooseModel } from "@src/utils";
import mongoose from "mongoose";

const roomMemberSchema = new mongoose.Schema<IRoomMember>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    joinTimestamp: { type: Number, required: true }
}, { _id: false });

const roomSchema = new mongoose.Schema<IRoom>({
    code: { type: String, required: true },
    currentMemberCount: { type: Number, required: true },
    memberLimit: { type: Number, required: true },
    members: { type: [roomMemberSchema], required: false, default: [] },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true }]
}, { timestamps: true })

export const Room = MongooseModel<IRoom>('Room', roomSchema)
import { IMessage } from "@src/types";
import { MongooseModel } from "@src/utils";
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema<IMessage>({
    content: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seen: { type: Boolean, required: false },
    timestamp: { type: Number, required: true } // TODO: remove in favor of createdAt and updatedAt?
}, { timestamps: true })

export const Message = MongooseModel<IMessage>('Message', messageSchema)
import { IMessage } from "@src/types";
import { MongooseModel } from "@src/utils";
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema<IMessage>({
    content: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

export const Message = MongooseModel<IMessage>('Message', messageSchema)
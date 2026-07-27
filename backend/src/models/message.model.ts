import type { IMessage } from '@src/types/message.types.js';
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema<IMessage>(
  {
    content: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  },
  { timestamps: true },
);

export const Message = mongoose.model<IMessage>('Message', messageSchema);

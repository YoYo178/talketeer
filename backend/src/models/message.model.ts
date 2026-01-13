import { IMessage } from '@src/types';
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema<IMessage>({
  content: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  isEdited: { type: Boolean, default: false },
  editedAt: { type: Date, default: null },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const Message = mongoose.model<IMessage>('Message', messageSchema);
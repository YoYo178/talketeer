import { IDMRoom, IRoom, IRoomMember } from '@src/types';
import mongoose from 'mongoose';

const roomMemberSchema = new mongoose.Schema<IRoomMember>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomRole: { type: String, enum: ['admin', 'member'] },
  joinTimestamp: { type: Number, required: true },
}, { _id: false });

const roomSchema = new mongoose.Schema<IRoom>({
  name: { type: String, required: true },
  code: { type: String, required: true },
  memberLimit: { type: Number, required: false, default: 10 },
  memberCount: { type: Number, required: false, default: 0 },
  members: { type: [roomMemberSchema], required: false, default: [] },
  isSystemGenerated: { type: Boolean, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
}, { timestamps: true });

export const Room = mongoose.model<IRoom>('Room', roomSchema);

const DMRoomSchema = new mongoose.Schema<IDMRoom>({
  isActive: { type: Boolean, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'IUser', required: true }],
}, { timestamps: true });

export const DMRoom = mongoose.model<IDMRoom>('DM', DMRoomSchema);
import mongoose from 'mongoose';

export interface IMessage {
  _id: mongoose.Types.ObjectId;

  sender: mongoose.Types.ObjectId;

  content: string;

  room: mongoose.Types.ObjectId;

  seenBy?: mongoose.Types.ObjectId[];

  createdAt: number;
  updatedAt: number;
}

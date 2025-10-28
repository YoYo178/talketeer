import mongoose from 'mongoose';
import { IUser } from './user.types';
import { IRoom } from './room.types';

export interface IMessage {
    _id: mongoose.Types.ObjectId;

    /** The user who sent the message */
    sender: mongoose.Types.ObjectId;

    /** The content of the message */
    content: string;

    /** The room the message was sent in */
    room: mongoose.Types.ObjectId;

    updatedAt: number;
    createdAt: number;
}
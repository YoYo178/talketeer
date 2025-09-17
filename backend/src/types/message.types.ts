import mongoose from "mongoose";
import { IUser } from "./user.types";
import { DBRef } from "./db.types";
import { IRoom } from "./room.types";

export interface IMessage {
    _id: mongoose.Types.ObjectId;

    /** The user who sent the message */
    sender: DBRef<IUser>;

    /** The content of the message */
    content: string;

    /** The room the message was sent in */
    room: DBRef<IRoom>;

    updatedAt: number;
    createdAt: number;
}
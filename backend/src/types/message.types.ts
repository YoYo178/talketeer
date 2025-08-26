import { ObjectId } from "mongoose";
import { IUser } from "./user.types";
import { DBRef } from "./db.types";

export interface IMessage {
    _id: ObjectId;

    /** The user who sent the message */
    sender: DBRef<IUser>;

    /** The content of the message */
    content: string;

    updatedAt: number;
    createdAt: number;
}
import { ObjectId } from "mongoose";
import { IUser } from "./user.types";
import { DBRef } from "./db.types";

export interface IMessage {
    _id: ObjectId;

    /** The user who sent the message */
    sender: DBRef<IUser>;

    /** The user to receive the message */
    recipient: DBRef<IUser>;

    /** The content of the message */
    content: string;

    /** The message creation timestamp
     * @todo Remove in favor of createdAt and updatedAt?
    */
    timestamp: number;

    /** Whether the user has seen the message or not
     * @todo Not sure if this will be implemented, and even if it will be, the type will probably be changed later
    */
    seen: boolean;
}
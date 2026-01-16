import mongoose from 'mongoose';

export interface IMessage {
    _id: mongoose.Types.ObjectId;

    /** The user who sent the message */
    sender: mongoose.Types.ObjectId;

    /** The content of the message */
    content: string;

    /** The room the message was sent in */
    room: mongoose.Types.ObjectId;

    /** Whether the message has been edited */
    isEdited: boolean;

    /** When the message was last edited */
    editedAt: Date | null;

    updatedAt: number;
    createdAt: number;
}
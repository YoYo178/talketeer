export interface IMessage {
    _id: string;

    /** The user who sent the message */
    sender: string;

    /** The content of the message */
    content: string;

    /** The room the message was sent in */
    room: string;
    seenBy?: string[];

    createdAt: string;
    updatedAt: string;
}
export interface IMessage {
    _id: string;

    /** The user who sent the message */
    sender: string;

    /** The content of the message */
    content: string;

    /** The room the message was sent in */
    room: string;

    /** Whether the message has been edited */
    isEdited?: boolean;

    /** When the message was last edited */
    editedAt?: string | null;

    /** Whether the message has been deleted (soft delete) */
    isDeleted?: boolean;

    createdAt: string;
    updatedAt: string;
}
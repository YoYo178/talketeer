import { INotification } from "@src/types";
import mongoose from "mongoose";

const notificationTypes = ['friend-request', 'friend-new', 'friend-delete', 'room-ban', 'room-delete', 'room-invite', 'room-kick', 'system', 'unknown']

const notificationSchema = new mongoose.Schema<INotification>({
    content: { type: String, required: true },
    type: { type: String, required: true, enum: notificationTypes, default: 'unknown' },

    // TTL target field
    createdAt: { type: Date, expires: '7d', default: Date.now },
}, { timestamps: true });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
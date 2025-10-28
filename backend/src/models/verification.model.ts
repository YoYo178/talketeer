import { IVerification } from "@src/types";
import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema<IVerification>({
    code: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    purpose: { type: String, enum: ['email-verification', 'reset-password'], required: true },
    token: { type: String, required: true },

    // TTL target field
    createdAt: { type: Date, expires: 600, default: Date.now },
}, { timestamps: true });

export const Verification = mongoose.model<IVerification>('Verification', verificationSchema);
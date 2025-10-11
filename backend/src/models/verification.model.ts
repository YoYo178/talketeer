import { IVerification } from "@src/types";
import { MongooseModel } from "@src/utils";
import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema<IVerification>({
    code: { type: String, required: true },
    email: { type: String, required: true },
    purpose: { type: String, enum: ['email-verification', 'password-reset'], required: true },
    token: { type: String, required: true },

    // TTL target field
    createdAt: { type: Date, expires: 600, default: Date.now },
}, { timestamps: true });

export const Verification = MongooseModel<IVerification>('Verification', verificationSchema);
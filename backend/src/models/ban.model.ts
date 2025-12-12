import { IBan } from '@src/types';
import mongoose from 'mongoose';

const banSchema = new mongoose.Schema<IBan>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  reason: { type: String, required: false, default: 'No reason provided.' },

  isPermanent: { type: Boolean, required: false, default: false },

  // MongoDB TTL field
  expiresAt: { type: Date, index: { expires: 0 }, required: false, default: null },
}, { timestamps: true });

// Enforce consistency for isPermanent and expiresAt fields
banSchema.pre('save', function () {
  if (this.isPermanent) {
    this.expiresAt = null;
  } else {
    if (!this.expiresAt)
      throw new Error('Timed bans must include the expiresAt field!');
  }
});

export const Ban = mongoose.model<IBan>('Ban', banSchema);
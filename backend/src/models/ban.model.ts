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
banSchema.pre('save', function (next) {
  if (this.isPermanent) {
    this.expiresAt = null;
    next();
  } else {
    if (!this.expiresAt)
      return next(new Error('Timed bans must include the expiresAt field!'));
        
    next();
  }
});

export const Ban = mongoose.model<IBan>('Ban', banSchema);
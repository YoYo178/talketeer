import { z } from 'zod';
import mongoose from 'mongoose';

export const mongooseObjectId = z
  .string()
  .nonempty()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    error: 'Invalid ObjectId',
  });
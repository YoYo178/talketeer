import mongoose from 'mongoose';

export type DBRef<T> = mongoose.Types.ObjectId | T;
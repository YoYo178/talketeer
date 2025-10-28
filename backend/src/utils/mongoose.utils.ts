import mongoose from 'mongoose';

/** Returns a mongoose model typed to the provided generic type */
export function MongooseModel<T>(docName: string, docSchema: mongoose.Schema): mongoose.Model<T & mongoose.Document> {
    return mongoose.model<T & mongoose.Document>(docName, docSchema);
}
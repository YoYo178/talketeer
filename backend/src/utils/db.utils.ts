import { Document, model, Model, Schema } from 'mongoose';

/** Returns a mongoose model typed to the provided generic type */
export function MongooseModel<T>(docName: string, docSchema: Schema): Model<T & Document> {
    return model<T & Document>(docName, docSchema);
}
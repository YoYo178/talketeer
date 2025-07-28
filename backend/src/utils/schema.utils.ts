import { z, ZodError } from 'zod';
import mongoose from 'mongoose';

export const mongooseObjectId = z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        error: "Invalid ObjectId",
    });

export function getTextValidationErrors(error: ZodError): string[] {
    const errors: string[] = [];

    const validationErrorTree = z.treeifyError(error);

    // @ts-ignore
    [...Object.values(validationErrorTree.properties || {})].forEach(prop => prop.errors.forEach(error => errors.push(error)))

    return errors;
}
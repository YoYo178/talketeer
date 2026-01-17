import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import mongoose from 'mongoose';
import { mongooseObjectId } from '@src/utils/schema.utils';

describe('Schema Utils', () => {
    describe('mongooseObjectId', () => {
        it('should validate a valid ObjectId string', () => {
            const validId = new mongoose.Types.ObjectId().toString();
            const result = mongooseObjectId.safeParse(validId);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toBe(validId);
            }
        });

        it('should reject an invalid ObjectId string', () => {
            const invalidId = 'not-a-valid-id';
            const result = mongooseObjectId.safeParse(invalidId);

            expect(result.success).toBe(false);
        });

        it('should reject an empty string', () => {
            const result = mongooseObjectId.safeParse('');

            expect(result.success).toBe(false);
        });

        it('should reject undefined', () => {
            const result = mongooseObjectId.safeParse(undefined);

            expect(result.success).toBe(false);
        });

        it('should reject null', () => {
            const result = mongooseObjectId.safeParse(null);

            expect(result.success).toBe(false);
        });

        it('should reject a number', () => {
            const result = mongooseObjectId.safeParse(12345);

            expect(result.success).toBe(false);
        });

        it('should reject an object', () => {
            const result = mongooseObjectId.safeParse({ id: '123' });

            expect(result.success).toBe(false);
        });

        it('should validate multiple valid ObjectIds', () => {
            const validIds = [
                '507f1f77bcf86cd799439011',
                '507f191e810c19729de860ea',
                new mongoose.Types.ObjectId().toString(),
                new mongoose.Types.ObjectId().toString(),
            ];

            validIds.forEach((id) => {
                const result = mongooseObjectId.safeParse(id);
                expect(result.success).toBe(true);
            });
        });

        it('should reject ObjectIds with wrong length', () => {
            const wrongLengthIds = [
                '507f1f77bcf86cd79943901', // too short
                '507f1f77bcf86cd7994390111', // too long
                '507f1f77bcf86cd7', // way too short
            ];

            wrongLengthIds.forEach((id) => {
                const result = mongooseObjectId.safeParse(id);
                expect(result.success).toBe(false);
            });
        });

        it('should reject ObjectIds with invalid characters', () => {
            const invalidCharIds = [
                '507f1f77bcf86cd79943901g', // 'g' is invalid
                '507f1f77bcf86cd79943901!', // special char
                '507f1f77bcf86cd79943901 ', // space
            ];

            invalidCharIds.forEach((id) => {
                const result = mongooseObjectId.safeParse(id);
                expect(result.success).toBe(false);
            });
        });

        it('should work within a larger schema', () => {
            const userSchema = z.object({
                userId: mongooseObjectId,
                name: z.string(),
            });

            const validData = {
                userId: new mongoose.Types.ObjectId().toString(),
                name: 'Test User',
            };

            const result = userSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should provide a meaningful error message for invalid ObjectId', () => {
            const result = mongooseObjectId.safeParse('invalid');

            expect(result.success).toBe(false);
            if (!result.success) {
                const errorMessage = result.error.issues[0].message;
                expect(errorMessage).toContain('Invalid ObjectId');
            }
        });
    });
});

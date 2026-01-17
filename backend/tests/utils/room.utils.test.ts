import { describe, it, expect } from 'vitest';
import { generateRoomCode, sanitizeRoomObj } from '@src/utils/room.utils';
import { IRoom, IRoomPublicView } from '@src/types';
import mongoose from 'mongoose';

describe('Room Utils', () => {
    describe('generateRoomCode', () => {
        it('should generate a room code of specified length', () => {
            const code = generateRoomCode(6);

            expect(code).toHaveLength(6);
        });

        it('should generate a room code with only uppercase letters and numbers', () => {
            const code = generateRoomCode(10);
            const validChars = /^[A-Z0-9]+$/;

            expect(code).toMatch(validChars);
        });

        it('should generate different codes on each call', () => {
            const codes = new Set<string>();

            // Generate 100 codes and check they're mostly unique
            for (let i = 0; i < 100; i++) {
                codes.add(generateRoomCode(8));
            }

            // With 8 characters and 36 possible chars, collision should be very rare
            expect(codes.size).toBeGreaterThan(95);
        });

        it('should handle length of 1', () => {
            const code = generateRoomCode(1);

            expect(code).toHaveLength(1);
            expect(code).toMatch(/^[A-Z0-9]$/);
        });

        it('should handle length of 0', () => {
            const code = generateRoomCode(0);

            expect(code).toBe('');
        });

        it('should generate long codes correctly', () => {
            const code = generateRoomCode(50);

            expect(code).toHaveLength(50);
            expect(code).toMatch(/^[A-Z0-9]+$/);
        });
    });

    describe('sanitizeRoomObj', () => {
        const mockUserId = new mongoose.Types.ObjectId();
        const mockOtherUserId = new mongoose.Types.ObjectId();

        const createMockRoom = (memberUserIds: mongoose.Types.ObjectId[]): IRoom => ({
            _id: new mongoose.Types.ObjectId(),
            name: 'Test Room',
            code: 'ABC123',
            visibility: 'private',
            isSystemGenerated: false,
            owner: mockUserId,
            members: memberUserIds.map(userId => ({
                user: userId,
                roomRole: 'member' as const,
                joinTimestamp: Date.now(),
            })),
            memberCount: memberUserIds.length,
            memberLimit: 50,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        it('should return full room object when user is a member', () => {
            const room = createMockRoom([mockUserId, mockOtherUserId]);
            const result = sanitizeRoomObj(room, mockUserId.toString());

            expect(result).toEqual(room);
            expect((result as IRoom).code).toBe('ABC123');
            expect((result as IRoom).members).toHaveLength(2);
        });

        it('should return sanitized room object when user is NOT a member', () => {
            const room = createMockRoom([mockOtherUserId]);
            const nonMemberUserId = new mongoose.Types.ObjectId().toString();
            const result = sanitizeRoomObj(room, nonMemberUserId) as IRoomPublicView;

            expect(result.code).toBeUndefined();
            expect(result.members).toBeUndefined();
            expect(result.name).toBe('Test Room');
        });

        it('should preserve other properties when sanitizing', () => {
            const room = createMockRoom([mockOtherUserId]);
            const nonMemberUserId = new mongoose.Types.ObjectId().toString();
            const result = sanitizeRoomObj(room, nonMemberUserId) as IRoomPublicView;

            expect(result.name).toBe('Test Room');
            expect(result.visibility).toBe('private');
            expect(result.isSystemGenerated).toBe(false);
        });

        it('should handle empty members array', () => {
            const room = createMockRoom([]);
            const result = sanitizeRoomObj(room, mockUserId.toString()) as IRoomPublicView;

            // User is not in empty members array, so should be sanitized
            expect(result.code).toBeUndefined();
            expect(result.members).toBeUndefined();
        });

        it('should correctly check membership by string comparison', () => {
            const room = createMockRoom([mockUserId]);
            const userIdString = mockUserId.toString();
            const result = sanitizeRoomObj(room, userIdString);

            expect((result as IRoom).code).toBe('ABC123');
        });
    });
});

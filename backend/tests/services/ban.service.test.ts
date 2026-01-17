import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import mongoose from 'mongoose';

// Create mock functions
const mockFind = vi.fn();
const mockFindOne = vi.fn();
const mockCreate = vi.fn();
const mockDeleteOne = vi.fn();

// Mock the models module before any imports
vi.mock('@src/models', () => ({
    Ban: {
        find: (...args: unknown[]) => mockFind(...args),
        findOne: (...args: unknown[]) => mockFindOne(...args),
        create: (...args: unknown[]) => mockCreate(...args),
        deleteOne: (...args: unknown[]) => mockDeleteOne(...args),
    },
}));

// Import after mocking
import {
    getBans,
    getBan,
    banUser,
    unbanUser,
    isUserBanned,
} from '@src/services/ban.service';

describe('Ban Service', () => {
    const mockUserId = new mongoose.Types.ObjectId().toString();
    const mockRoomId = new mongoose.Types.ObjectId().toString();
    const mockBannedById = new mongoose.Types.ObjectId().toString();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getBans', () => {
        it('should return all bans for a room', async () => {
            const mockBans = [
                { userId: mockUserId, roomId: mockRoomId, reason: 'Spam' },
                { userId: 'user2', roomId: mockRoomId, reason: 'Harassment' },
            ];

            mockFind.mockReturnValue({
                lean: () => ({
                    exec: () => Promise.resolve(mockBans),
                }),
            });

            const result = await getBans(mockRoomId);

            expect(mockFind).toHaveBeenCalledWith({ roomId: mockRoomId });
            expect(result).toEqual(mockBans);
            expect(result).toHaveLength(2);
        });

        it('should return empty array when no bans exist', async () => {
            mockFind.mockReturnValue({
                lean: () => ({
                    exec: () => Promise.resolve([]),
                }),
            });

            const result = await getBans(mockRoomId);

            expect(result).toEqual([]);
        });
    });

    describe('getBan', () => {
        it('should return a specific ban', async () => {
            const expectedBan = {
                userId: mockUserId,
                roomId: mockRoomId,
                reason: 'Spam',
            };

            mockFindOne.mockReturnValue({
                lean: () => ({
                    exec: () => Promise.resolve(expectedBan),
                }),
            });

            const result = await getBan(mockUserId, mockRoomId);

            expect(mockFindOne).toHaveBeenCalledWith({
                userId: mockUserId,
                roomId: mockRoomId,
            });
            expect(result).toEqual(expectedBan);
        });

        it('should return null when ban does not exist', async () => {
            mockFindOne.mockReturnValue({
                lean: () => ({
                    exec: () => Promise.resolve(null),
                }),
            });

            const result = await getBan(mockUserId, mockRoomId);

            expect(result).toBeNull();
        });
    });

    describe('isUserBanned', () => {
        it('should return true when user is banned', async () => {
            mockFindOne.mockReturnValue({
                select: () => ({
                    lean: () => ({
                        exec: () => Promise.resolve({ _id: 'ban-id' }),
                    }),
                }),
            });

            const result = await isUserBanned(mockUserId, mockRoomId);

            expect(result).toBe(true);
        });

        it('should return false when user is not banned', async () => {
            mockFindOne.mockReturnValue({
                select: () => ({
                    lean: () => ({
                        exec: () => Promise.resolve(null),
                    }),
                }),
            });

            const result = await isUserBanned(mockUserId, mockRoomId);

            expect(result).toBe(false);
        });
    });

    describe('banUser', () => {
        const banData = {
            userId: new mongoose.Types.ObjectId(mockUserId),
            roomId: new mongoose.Types.ObjectId(mockRoomId),
            bannedBy: new mongoose.Types.ObjectId(mockBannedById),
            reason: 'Spamming',
        };

        it('should create a new ban when user is not already banned', async () => {
            // Mock isUserBanned to return false
            mockFindOne.mockReturnValue({
                select: () => ({
                    lean: () => ({
                        exec: () => Promise.resolve(null),
                    }),
                }),
            });

            const createdBan = { ...banData, _id: 'new-ban-id' };
            mockCreate.mockResolvedValue({
                toObject: () => createdBan,
            });

            const result = await banUser(banData);

            expect(mockCreate).toHaveBeenCalled();
            expect(result).toEqual(createdBan);
        });

        it('should return existing ban when user is already banned', async () => {
            const existingBan = { ...banData, _id: 'existing-ban-id' };

            // First call: isUserBanned check (returns true)
            // Second call: getBan (returns the existing ban)
            mockFindOne
                .mockReturnValueOnce({
                    select: () => ({
                        lean: () => ({
                            exec: () => Promise.resolve({ _id: 'existing-ban-id' }),
                        }),
                    }),
                })
                .mockReturnValueOnce({
                    lean: () => ({
                        exec: () => Promise.resolve(existingBan),
                    }),
                });

            const result = await banUser(banData);

            expect(mockCreate).not.toHaveBeenCalled();
            expect(result).toEqual(existingBan);
        });
    });

    describe('unbanUser', () => {
        it('should delete ban when user is banned', async () => {
            // Mock isUserBanned to return true
            mockFindOne.mockReturnValue({
                select: () => ({
                    lean: () => ({
                        exec: () => Promise.resolve({ _id: 'ban-id' }),
                    }),
                }),
            });

            await unbanUser(mockUserId, mockRoomId);

            expect(mockDeleteOne).toHaveBeenCalledWith({
                userId: mockUserId,
                roomId: mockRoomId,
            });
        });

        it('should not call deleteOne when user is not banned', async () => {
            // Mock isUserBanned to return false
            mockFindOne.mockReturnValue({
                select: () => ({
                    lean: () => ({
                        exec: () => Promise.resolve(null),
                    }),
                }),
            });

            await unbanUser(mockUserId, mockRoomId);

            expect(mockDeleteOne).not.toHaveBeenCalled();
        });
    });
});

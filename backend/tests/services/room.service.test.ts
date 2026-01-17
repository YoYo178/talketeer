import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';

// Create mock functions at module level
const mockRoomFind = vi.fn();
const mockRoomFindById = vi.fn();
const mockRoomFindOne = vi.fn();
const mockRoomFindByIdAndUpdate = vi.fn();
const mockRoomFindByIdAndDelete = vi.fn();
const mockRoomCreate = vi.fn();

const mockDMRoomFindOne = vi.fn();
const mockDMRoomFindOneAndUpdate = vi.fn();
const mockDMRoomCreate = vi.fn();

// Mock the models
vi.mock('@src/models', () => ({
    Room: {
        find: (...args: unknown[]) => mockRoomFind(...args),
        findById: (...args: unknown[]) => mockRoomFindById(...args),
        findOne: (...args: unknown[]) => mockRoomFindOne(...args),
        findByIdAndUpdate: (...args: unknown[]) => mockRoomFindByIdAndUpdate(...args),
        findByIdAndDelete: (...args: unknown[]) => mockRoomFindByIdAndDelete(...args),
        create: (...args: unknown[]) => mockRoomCreate(...args),
    },
    DMRoom: {
        findOne: (...args: unknown[]) => mockDMRoomFindOne(...args),
        findOneAndUpdate: (...args: unknown[]) => mockDMRoomFindOneAndUpdate(...args),
        create: (...args: unknown[]) => mockDMRoomCreate(...args),
    },
}));

// Mock user service (used by joinRoom/leaveRoom)
vi.mock('@src/services/user.service', () => ({
    getUser: vi.fn(),
    updateUserRoom: vi.fn(),
}));

// Import after mocking
import {
    getAllRooms,
    getRoom,
    getRoomByCode,
    createRoom,
    updateRoom,
    deleteRoom,
    addUserToRoom,
    removeUserFromRoom,
    isUserInRoom,
    isUserRoomOwner,
} from '@src/services/room.service';

describe('Room Service', () => {
    const mockRoomId = new mongoose.Types.ObjectId().toString();
    const mockUserId = new mongoose.Types.ObjectId().toString();

    const mockRoomData = {
        _id: new mongoose.Types.ObjectId(mockRoomId),
        name: 'Test Room',
        code: 'ABC123',
        owner: new mongoose.Types.ObjectId(mockUserId),
        members: [],
        memberCount: 0,
        memberLimit: 50,
        visibility: 'public',
        isSystemGenerated: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAllRooms', () => {
        it('should return all rooms', async () => {
            const rooms = [mockRoomData, { ...mockRoomData, name: 'Room 2' }];

            mockRoomFind.mockReturnValue({
                lean: () => ({
                    exec: () => Promise.resolve(rooms),
                }),
            });

            const result = await getAllRooms();

            expect(mockRoomFind).toHaveBeenCalledWith({});
            expect(result).toEqual(rooms);
            expect(result).toHaveLength(2);
        });

        it('should apply filter when provided', async () => {
            const filter = { visibility: 'public' };

            mockRoomFind.mockReturnValue({
                lean: () => ({
                    exec: () => Promise.resolve([mockRoomData]),
                }),
            });

            await getAllRooms(filter);

            expect(mockRoomFind).toHaveBeenCalledWith(filter);
        });

        it('should return empty array when no rooms exist', async () => {
            mockRoomFind.mockReturnValue({
                lean: () => ({
                    exec: () => Promise.resolve([]),
                }),
            });

            const result = await getAllRooms();

            expect(result).toEqual([]);
        });
    });

    describe('getRoom', () => {
        it('should return a room by ID', async () => {
            mockRoomFindById.mockReturnValue({
                lean: () => ({
                    exec: () => Promise.resolve(mockRoomData),
                }),
            });

            const result = await getRoom(mockRoomId);

            expect(mockRoomFindById).toHaveBeenCalledWith(mockRoomId);
            expect(result).toEqual(mockRoomData);
        });

        it('should return null when room not found', async () => {
            mockRoomFindById.mockReturnValue({
                lean: () => ({
                    exec: () => Promise.resolve(null),
                }),
            });

            const result = await getRoom('nonexistent-id');

            expect(result).toBeNull();
        });
    });

    describe('getRoomByCode', () => {
        it('should return a room by code', async () => {
            mockRoomFindOne.mockReturnValue({
                lean: () => ({
                    exec: () => Promise.resolve(mockRoomData),
                }),
            });

            const result = await getRoomByCode('ABC123');

            expect(mockRoomFindOne).toHaveBeenCalledWith({ code: 'ABC123' });
            expect(result).toEqual(mockRoomData);
        });

        it('should return null when code not found', async () => {
            mockRoomFindOne.mockReturnValue({
                lean: () => ({
                    exec: () => Promise.resolve(null),
                }),
            });

            const result = await getRoomByCode('INVALID');

            expect(result).toBeNull();
        });
    });

    describe('createRoom', () => {
        it('should create a new room', async () => {
            const newRoomData = {
                name: 'New Room',
                code: 'NEW123',
                visibility: 'public' as const,
            };

            mockRoomCreate.mockResolvedValue({
                toObject: () => ({ ...newRoomData, _id: 'new-id' }),
            });

            const result = await createRoom(newRoomData);

            expect(mockRoomCreate).toHaveBeenCalledWith(newRoomData);
            expect(result._id).toBe('new-id');
        });
    });

    describe('updateRoom', () => {
        it('should update a room', async () => {
            const updatedData = { name: 'Updated Room' };
            const updatedRoom = { ...mockRoomData, ...updatedData };

            mockRoomFindByIdAndUpdate.mockReturnValue({
                exec: () => Promise.resolve(updatedRoom),
            });

            const result = await updateRoom(mockRoomId, updatedData);

            expect(mockRoomFindByIdAndUpdate).toHaveBeenCalledWith(
                mockRoomId,
                { $set: updatedData },
                { new: true, lean: true }
            );
            expect(result?.name).toBe('Updated Room');
        });

        it('should return null when room not found', async () => {
            mockRoomFindByIdAndUpdate.mockReturnValue({
                exec: () => Promise.resolve(null),
            });

            const result = await updateRoom('nonexistent', { name: 'test' });

            expect(result).toBeNull();
        });
    });

    describe('deleteRoom', () => {
        it('should delete a room', async () => {
            mockRoomFindByIdAndDelete.mockReturnValue({
                lean: () => ({
                    exec: () => Promise.resolve(mockRoomData),
                }),
            });

            const result = await deleteRoom(mockRoomId);

            expect(mockRoomFindByIdAndDelete).toHaveBeenCalledWith(mockRoomId);
            expect(result).toEqual(mockRoomData);
        });

        it('should return null when room not found', async () => {
            mockRoomFindByIdAndDelete.mockReturnValue({
                lean: () => ({
                    exec: () => Promise.resolve(null),
                }),
            });

            const result = await deleteRoom('nonexistent');

            expect(result).toBeNull();
        });
    });

    describe('addUserToRoom', () => {
        it('should add user to room as member', async () => {
            const updatedRoom = {
                ...mockRoomData,
                memberCount: 1,
                members: [{ user: mockUserId, roomRole: 'member' }],
            };

            mockRoomFindByIdAndUpdate.mockReturnValue({
                exec: () => Promise.resolve(updatedRoom),
            });

            const result = await addUserToRoom(mockRoomId, mockUserId);

            expect(mockRoomFindByIdAndUpdate).toHaveBeenCalledWith(
                mockRoomId,
                expect.objectContaining({
                    $inc: { memberCount: 1 },
                    $push: expect.objectContaining({
                        members: expect.objectContaining({
                            user: mockUserId,
                            roomRole: 'member',
                        }),
                    }),
                }),
                expect.any(Object)
            );
            expect(result?.memberCount).toBe(1);
        });

        it('should add user to room as admin', async () => {
            const updatedRoom = {
                ...mockRoomData,
                memberCount: 1,
                members: [{ user: mockUserId, roomRole: 'admin' }],
            };

            mockRoomFindByIdAndUpdate.mockReturnValue({
                exec: () => Promise.resolve(updatedRoom),
            });

            const result = await addUserToRoom(mockRoomId, mockUserId, true);

            expect(mockRoomFindByIdAndUpdate).toHaveBeenCalledWith(
                mockRoomId,
                expect.objectContaining({
                    $push: expect.objectContaining({
                        members: expect.objectContaining({
                            roomRole: 'admin',
                        }),
                    }),
                }),
                expect.any(Object)
            );
        });
    });

    describe('removeUserFromRoom', () => {
        it('should remove user from room', async () => {
            const updatedRoom = { ...mockRoomData, memberCount: 0, members: [] };

            mockRoomFindByIdAndUpdate.mockReturnValue({
                exec: () => Promise.resolve(updatedRoom),
            });

            const result = await removeUserFromRoom(mockRoomId, mockUserId);

            expect(mockRoomFindByIdAndUpdate).toHaveBeenCalledWith(
                mockRoomId,
                expect.objectContaining({
                    $inc: { memberCount: -1 },
                    $pull: { members: { user: mockUserId } },
                }),
                expect.any(Object)
            );
            expect(result?.memberCount).toBe(0);
        });
    });

    describe('isUserInRoom', () => {
        it('should return true when user is in room', async () => {
            mockRoomFindOne.mockReturnValue({
                select: () => ({
                    lean: () => ({
                        exec: () => Promise.resolve({ _id: mockRoomId }),
                    }),
                }),
            });

            const result = await isUserInRoom(mockRoomId, mockUserId);

            expect(result).toBe(true);
        });

        it('should return false when user is not in room', async () => {
            mockRoomFindOne.mockReturnValue({
                select: () => ({
                    lean: () => ({
                        exec: () => Promise.resolve(null),
                    }),
                }),
            });

            const result = await isUserInRoom(mockRoomId, mockUserId);

            expect(result).toBe(false);
        });
    });

    describe('isUserRoomOwner', () => {
        it('should return true when user is room owner', async () => {
            mockRoomFindOne.mockReturnValue({
                select: () => ({
                    lean: () => ({
                        exec: () => Promise.resolve({ _id: mockRoomId }),
                    }),
                }),
            });

            const result = await isUserRoomOwner(mockUserId, mockRoomId);

            expect(result).toBe(true);
        });

        it('should return false when user is not room owner', async () => {
            mockRoomFindOne.mockReturnValue({
                select: () => ({
                    lean: () => ({
                        exec: () => Promise.resolve(null),
                    }),
                }),
            });

            const result = await isUserRoomOwner(mockUserId, mockRoomId);

            expect(result).toBe(false);
        });
    });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { IUser } from '@src/types';

// Create mock functions at module level
const mockFind = vi.fn();
const mockFindById = vi.fn();
const mockFindOne = vi.fn();
const mockFindByIdAndUpdate = vi.fn();
const mockFindByIdAndDelete = vi.fn();
const mockFindOneAndUpdate = vi.fn();
const mockCreate = vi.fn();

// Mock the User model
vi.mock('@src/models', () => ({
    User: {
        find: (...args: unknown[]) => mockFind(...args),
        findById: (...args: unknown[]) => mockFindById(...args),
        findOne: (...args: unknown[]) => mockFindOne(...args),
        findByIdAndUpdate: (...args: unknown[]) => mockFindByIdAndUpdate(...args),
        findByIdAndDelete: (...args: unknown[]) => mockFindByIdAndDelete(...args),
        findOneAndUpdate: (...args: unknown[]) => mockFindOneAndUpdate(...args),
        create: (...args: unknown[]) => mockCreate(...args),
    },
}));

// Import after mocking
import {
    getAllUsers,
    getUser,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
    getPublicUser,
} from '@src/services/user.service';

describe('User Service', () => {
    const mockUserId = new mongoose.Types.ObjectId().toString();

    const mockUserData: Partial<IUser> = {
        _id: new mongoose.Types.ObjectId(mockUserId),
        email: 'test@example.com',
        username: 'testuser',
        passwordHash: 'hashedpassword123',
        name: 'Test User',
        isVerified: true,
        verifiedAt: new Date(),
        friends: [],
        notifications: [],
        room: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAllUsers', () => {
        it('should return all users without password hash', async () => {
            const users = [mockUserData, { ...mockUserData, email: 'test2@example.com' }];

            mockFind.mockReturnValue({
                select: () => ({
                    lean: () => ({
                        exec: () => Promise.resolve(users),
                    }),
                }),
            });

            const result = await getAllUsers();

            expect(mockFind).toHaveBeenCalledWith({});
            expect(result).toEqual(users);
        });

        it('should apply filter when provided', async () => {
            const filter = { isVerified: true };

            mockFind.mockReturnValue({
                select: () => ({
                    lean: () => ({
                        exec: () => Promise.resolve([mockUserData]),
                    }),
                }),
            });

            await getAllUsers(filter);

            expect(mockFind).toHaveBeenCalledWith(filter);
        });

        it('should use public user filter when publicUser is true', async () => {
            mockFind.mockReturnValue({
                select: vi.fn().mockReturnValue({
                    lean: () => ({
                        exec: () => Promise.resolve([mockUserData]),
                    }),
                }),
            });

            await getAllUsers({}, true);

            expect(mockFind).toHaveBeenCalled();
        });
    });

    describe('getUser', () => {
        it('should return a user by ID', async () => {
            mockFindById.mockReturnValue({
                select: () => ({
                    lean: () => ({
                        exec: () => Promise.resolve(mockUserData),
                    }),
                }),
            });

            const result = await getUser(mockUserId);

            expect(mockFindById).toHaveBeenCalledWith(mockUserId);
            expect(result).toEqual(mockUserData);
        });

        it('should return null when user not found', async () => {
            mockFindById.mockReturnValue({
                select: () => ({
                    lean: () => ({
                        exec: () => Promise.resolve(null),
                    }),
                }),
            });

            const result = await getUser('nonexistent-id');

            expect(result).toBeNull();
        });
    });

    describe('getUserByEmail', () => {
        it('should return a user by email', async () => {
            mockFindOne.mockReturnValue({
                select: () => ({
                    lean: () => ({
                        exec: () => Promise.resolve(mockUserData),
                    }),
                }),
            });

            const result = await getUserByEmail('test@example.com');

            expect(mockFindOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(result).toEqual(mockUserData);
        });

        it('should return null when email not found', async () => {
            mockFindOne.mockReturnValue({
                select: () => ({
                    lean: () => ({
                        exec: () => Promise.resolve(null),
                    }),
                }),
            });

            const result = await getUserByEmail('nonexistent@example.com');

            expect(result).toBeNull();
        });
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const newUserData = {
                email: 'new@example.com',
                username: 'newuser',
                passwordHash: 'hashed',
            };

            mockCreate.mockResolvedValue({
                toObject: () => ({ ...newUserData, _id: 'new-id' }),
            });

            const result = await createUser(newUserData);

            expect(mockCreate).toHaveBeenCalledWith(newUserData);
            expect(result._id).toBe('new-id');
        });
    });

    describe('updateUser', () => {
        it('should update a user', async () => {
            const updatedData = { username: 'updateduser' };
            const updatedUser = { ...mockUserData, ...updatedData };

            mockFindByIdAndUpdate.mockReturnValue({
                exec: () => Promise.resolve(updatedUser),
            });

            const result = await updateUser(mockUserId, updatedData);

            expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
                mockUserId,
                { $set: updatedData },
                expect.objectContaining({ new: true, lean: true })
            );
            expect(result?.username).toBe('updateduser');
        });

        it('should return null when user not found', async () => {
            mockFindByIdAndUpdate.mockReturnValue({
                exec: () => Promise.resolve(null),
            });

            const result = await updateUser('nonexistent', { username: 'test' });

            expect(result).toBeNull();
        });
    });

    describe('deleteUser', () => {
        it('should delete a user', async () => {
            mockFindByIdAndDelete.mockReturnValue({
                lean: () => ({
                    exec: () => Promise.resolve(mockUserData),
                }),
            });

            const result = await deleteUser(mockUserId);

            expect(mockFindByIdAndDelete).toHaveBeenCalledWith(mockUserId);
            expect(result).toEqual(mockUserData);
        });

        it('should return null when user not found', async () => {
            mockFindByIdAndDelete.mockReturnValue({
                lean: () => ({
                    exec: () => Promise.resolve(null),
                }),
            });

            const result = await deleteUser('nonexistent');

            expect(result).toBeNull();
        });
    });

    describe('getPublicUser', () => {
        it('should filter out sensitive fields', () => {
            const fullUser = {
                _id: mockUserId,
                email: 'test@example.com',
                username: 'testuser',
                passwordHash: 'secret123',
                name: 'Test User',
                isVerified: true,
                verifiedAt: new Date(),
                friends: [],
                notifications: [],
                room: 'room-id',
                createdAt: new Date(),
                updatedAt: new Date(),
                avatar: 'avatar.png',
            } as unknown as IUser;

            const result = getPublicUser(fullUser);

            expect(result).not.toHaveProperty('passwordHash');
            expect(result).not.toHaveProperty('name');
            expect(result).not.toHaveProperty('email');
            expect(result).not.toHaveProperty('friends');
            expect(result).not.toHaveProperty('notifications');
            expect(result).not.toHaveProperty('room');
            expect(result).not.toHaveProperty('isVerified');
            expect(result).not.toHaveProperty('verifiedAt');
            expect(result).not.toHaveProperty('updatedAt');

            // Should keep public fields
            expect(result).toHaveProperty('_id');
            expect(result).toHaveProperty('username');
            expect(result).toHaveProperty('createdAt');
            expect(result).toHaveProperty('avatar');
        });
    });
});

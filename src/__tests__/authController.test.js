import { register, login, getUsers } from '../controllers/authController';
import { validationResult, matchedData } from 'express-validator';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

let mongoServer;

jest.mock('express-validator');
jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

beforeEach(() => {
    // Mock bcrypt.hash to return a hashed password
    bcrypt.hash.mockResolvedValue('hashedPassword');
});

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe('register', () => {

    it('should return 400 if validation fails', async () => {
        validationResult.mockReturnValueOnce({ isEmpty: () => false, array: () => ['error'] });
        const req = { body: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await register(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ errors: ['error'] });
    });

    it('should return 409 if username already exists (duplicate key error)', async () => {
        validationResult.mockReturnValueOnce({ isEmpty: () => true });
        matchedData.mockReturnValueOnce({ username: 'existingUser', password: 'test' });

        // Mock User.save to simulate a duplicate key error
        const duplicateKeyError = new Error('Duplicate key error');
        duplicateKeyError.code = 11000; // MongoDB duplicate key error code
        User.prototype.save.mockRejectedValueOnce(duplicateKeyError);

        const req = { body: { username: 'existingUser', password: 'test' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await register(req, res);
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ error: 'Username already exists' });
    });

    it('should return 500 if database error occurs (not duplicate key error)', async () => {
        validationResult.mockReturnValueOnce({ isEmpty: () => true });
        matchedData.mockReturnValueOnce({ username: 'test', password: 'test' });

        // Mock User.save to simulate an error
        const dbError = new Error('Database error');
        dbError.code = 1; // MongoDB error code
        User.prototype.save.mockRejectedValueOnce(dbError);

        const req = { body: { username: 'test', password: 'test' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await register(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });

    it('should return 201 if registration is successful', async () => {
        validationResult.mockReturnValueOnce({ isEmpty: () => true });
        matchedData.mockReturnValueOnce({ username: 'test', password: 'test' });
        const req = { body: { username: 'test', password: 'test' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await register(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Registration successful. Please log in.' });
    });
});

describe('login', () => {
    it('should return 401 if user does not exist', async () => {
        validationResult.mockReturnValueOnce({ isEmpty: () => true });
        matchedData.mockReturnValueOnce({ username: 'nonexistentUser', password: 'test' });

        // Mock User.findOne to simulate no user found
        User.findOne.mockResolvedValueOnce(null);

        const req = { body: { username: 'nonexistentUser', password: 'test' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return 401 if password is incorrect', async () => {
        validationResult.mockReturnValueOnce({ isEmpty: () => true });
        matchedData.mockReturnValueOnce({ username: 'existingUser', password: 'wrongPassword' });

        // Mock User.findOne to simulate user found
        User.findOne.mockResolvedValueOnce({ username: 'existingUser', password: 'hashedPassword' });

        const req = { body: { username: 'existingUser', password: 'wrongPassword' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return 200 if login is successful', async () => {
        validationResult.mockReturnValueOnce({ isEmpty: () => true });
        matchedData.mockReturnValueOnce({ username: 'existingUser', password: 'test' });

        // Mock User.findOne to simulate user found
        User.findOne.mockResolvedValueOnce({ username: 'existingUser', password: 'hashedPassword' });

        // Mock bcrypt.compare to simulate successful password comparison
        bcrypt.compare.mockResolvedValueOnce(true);

        // Mock jwt.sign to return a dummy token
        jwt.sign.mockReturnValueOnce('dummyToken');

        const req = { body: { username: 'existingUser', password: 'test' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token: 'dummyToken' });
    });

    it('should return 500 if database error occurs', async () => {
        validationResult.mockReturnValueOnce({ isEmpty: () => true });
        matchedData.mockReturnValueOnce({ username: 'test', password: 'test' });

        // Mock User.findOne to simulate an error
        const dbError = new Error('Database error');
        User.findOne.mockRejectedValueOnce(dbError);

        const req = { body: { username: 'test', password: 'test' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
});

describe('getUsers', () => {
    it('should return all users', async () => {
        const mockUsers = [{ username: 'user1' }, { username: 'user2' }];
        User.find.mockResolvedValue(mockUsers);
        const mockReq = {};
        const mockRes = {
            json: jest.fn(),
            status: jest.fn(() => mockRes), // to allow .status().json() chaining
        };

        await getUsers(mockReq, mockRes);
        expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should return 500 and an error message if an error occurs', async () => {
        const mockError = new Error('Test error');
        User.find.mockRejectedValue(mockError);
        const mockReq = {};
        const mockRes = {
            json: jest.fn(),
            status: jest.fn(() => mockRes), // to allow .status().json() chaining
        };

        await getUsers(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: mockError.message });
    });
});
// File: UserAuth.test.js
// Path: C:\CFH\backend\tests\user\UserAuth.test.js
// Purpose: Unit tests for UserAuth service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const UserAuth = require('@services/user/UserAuth');
const db = require('@services/db');
const logger = require('@utils/logger');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('@services/db');
jest.mock('@utils/logger');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('UserAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('registers user successfully', async () => {
      db.getUserByEmail.mockResolvedValueOnce(null);
      bcrypt.hash.mockResolvedValueOnce('hashedPassword');
      db.createUser.mockResolvedValueOnce('123');
      jwt.sign.mockReturnValueOnce('token');

      const result = await UserAuth.registerUser('test@example.com', 'password', 'buyer');
      expect(result).toEqual({ userId: '123', token: 'token' });
      expect(db.createUser).toHaveBeenCalledWith(expect.objectContaining({ email: 'test@example.com', role: 'buyer' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('User registered'));
    });

    it('throws error when user already exists', async () => {
      db.getUserByEmail.mockResolvedValueOnce({ id: '123' });
      await expect(UserAuth.registerUser('test@example.com', 'password', 'buyer')).rejects.toThrow('User already exists');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User already exists'));
    });
  });

  describe('loginUser', () => {
    it('logs in user successfully', async () => {
      db.getUserByEmail.mockResolvedValueOnce({ id: '123', password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValueOnce(true);
      jwt.sign.mockReturnValueOnce('token');

      const result = await UserAuth.loginUser('test@example.com', 'password');
      expect(result).toEqual({ userId: '123', token: 'token' });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('User logged in'));
    });

    it('throws error when user is not found', async () => {
      db.getUserByEmail.mockResolvedValueOnce(null);
      await expect(UserAuth.loginUser('test@example.com', 'password')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });

    it('throws error for invalid credentials', async () => {
      db.getUserByEmail.mockResolvedValueOnce({ id: '123', password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValueOnce(false);
      await expect(UserAuth.loginUser('test@example.com', 'password')).rejects.toThrow('Invalid credentials');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid credentials'));
    });
  });
});


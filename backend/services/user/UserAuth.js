// File: UserAuth.js
// Path: C:\CFH\backend\services\user\UserAuth.js
// Purpose: Handle user authentication and token management
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, jsonwebtoken, bcrypt

const logger = require('@utils/logger');
const db = require('@services/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserAuth = {
  async registerUser(email, password, role) {
    try {
      const existingUser = await db.getUserByEmail(email);
      if (existingUser) {
        logger.error(`[UserAuth] User already exists with email: ${email}`);
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { email, password: hashedPassword, role, createdAt: new Date().toISOString() };
      const userId = await db.createUser(user);
      const token = jwt.sign({ userId, email, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      logger.info(`[UserAuth] User registered with email: ${email}, role: ${role}`);
      return { userId, token };
    } catch (err) {
      logger.error(`[UserAuth] Failed to register user with email ${email}: ${err.message}`, err);
      throw err;
    }
  },

  async loginUser(email, password) {
    try {
      const user = await db.getUserByEmail(email);
      if (!user) {
        logger.error(`[UserAuth] User not found with email: ${email}`);
        throw new Error('User not found');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        logger.error(`[UserAuth] Invalid credentials for email: ${email}`);
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign({ userId: user.id, email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      logger.info(`[UserAuth] User logged in with email: ${email}`);
      return { userId: user.id, token };
    } catch (err) {
      logger.error(`[UserAuth] Failed to login user with email ${email}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = UserAuth;
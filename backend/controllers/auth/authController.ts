/**
 * © 2025 CFH, All Rights Reserved
 * File: authController.ts
 * Path: C:\CFH\backend\controllers\auth\authController.ts
 * Purpose: Handles user registration and login authentication with tier-based logic in the CFH Automotive Ecosystem.
 * Author: Mini Team (upgraded by Cod1, reviewed by Grok)
 * Date: 2025-07-14 [15:00]
 * Version: 1.1.0
 * Version ID: c5e4f2d3-8b7a-4c6d-9e3b-6f5a4d3c2b1e
 * Crown Certified: Yes (pending final test)
 * Batch ID: Compliance-070525
 * Artifact ID: a4b3c2d1-e0f9-8d7c-6b5a-4f3e2d1c0b9a
 * Save Location: C:\CFH\backend\controllers\auth\authController.ts
 * Updated By: Grok (based on Cod1 suggestions)
 * Timestamp: 2025-07-14 [15:00]
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax:
 * - Converted all CommonJS `require` statements to ES Module `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types for type safety.
 * - Created interfaces (`RegisterBody`, `LoginBody`, `JwtPayload`) to define the structure of request bodies and JWTs.
 *
 * 2. Separation of Concerns (Suggestion):
 * - Consider moving business logic for user creation, password hashing, and token generation to a dedicated `AuthService` for better maintainability and testing.
 *
 * 3. Error Handling & Logging:
 * - Replaced all `console.error` calls with the standardized `@utils/logger` for structured logging.
 * - Implemented the `next(error)` pattern to pass errors to a centralized error-handling middleware.
 * - Used custom error classes (`BadRequestError`, `AuthenticationError`) for consistent API responses.
 *
 * 4. Configuration & Constants (Suggestion):
 * - Consider moving `JWT_EXPIRATION` and `BCRYPT_SALT_ROUNDS` to a central configuration file for easier management.
 */

// --- Dependencies ---
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '@models/User'; // Alias import
import logger from '@utils/logger'; // Alias import
import { BadRequestError, AuthenticationError } from '@utils/errors'; // Alias import
import { validateRegister, validateLogin } from '@validation/auth.validation'; // Alias import

// --- Interfaces ---
interface RegisterBody {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface JwtPayload {
  userId: string;
  role: string;
  username: string;
}

// --- Configuration ---
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '7d';
const BCRYPT_SALT_ROUNDS = 10;

// --- Controller Functions ---

/**
 * @function registerUser
 * @desc Registers a new user, hashes their password, and returns a JWT.
 */
export const registerUser = async (req: Request<{}, {}, RegisterBody>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error } = validateRegister(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const payload: JwtPayload = {
      userId: newUser._id.toString(),
      role: newUser.role,
      username: newUser.username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: JWT_EXPIRATION });

    logger.info('User registered successfully', { email, correlationId: req.headers['x-correlation-id'] });
    res.status(201).json({
      message: 'User registered successfully',
      token,
      ...payload,
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`, { correlationId: req.headers['x-correlation-id'] });
    next(error);
  }
};

/**
 * @function loginUser
 * @desc Authenticates a user and returns a JWT upon successful login.
 */
export const loginUser = async (req: Request<{}, {}, LoginBody>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AuthenticationError('Invalid credentials');
    }

    const payload: JwtPayload = {
      userId: user._id.toString(),
      role: user.role,
      username: user.username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: JWT_EXPIRATION });

    logger.info('User logged in', { email, correlationId: req.headers['x-correlation-id'] });
    res.status(200).json({
      message: 'Login successful',
      token,
      ...payload,
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`, { correlationId: req.headers['x-correlation-id'] });
    next(error);
  }
};

// Premium/Wow++ Note: Add OTP for Wow++ login, device fingerprint for premium.

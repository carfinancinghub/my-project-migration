/**
 * © 2025 CFH, All Rights Reserved
 * File: UserController.ts
 * Path: C:\CFH\backend\controllers\UserController.ts
 * Purpose: Handles retrieving and updating user profiles.
 * Author: Mini Team, Grok
 * Date: 2025-07-07 [1539]
 * Version: 1.0.0
 * Version ID: r8s7t6u5-v4w3-x2y1-z0a9-b8c7d6e5f4g3
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: r8s7t6u5-v4w3-x2y1-z0a9-b8c7d6e5f4g3
 * Save Location: C:\CFH\backend\controllers\UserController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created interfaces (`AuthenticatedRequest`, `UpdateUserBody`).
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 * - Fixed logging syntax errors.
 *
 * 3. Validation [Grok]:
 * - Added `getMyProfileValidation`.
 *
 * 4. Services (Suggestion) [Mini]:
 * - Move database operations to `UserService.ts`.
 *
 * 5. Testing (Suggestion) [Grok]:
 * - Add unit tests for all endpoints.
 *
 * 6. Metadata [Grok]:
 * - Updated Author and Timestamp to distinguish from Mini’s version.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '@models/User';
import logger from '@utils/logger';
import { BadRequestError, NotFoundError, ForbiddenError, InternalServerError } from '@utils/errors';
import { getMyProfileValidation, userIdValidation, updateUserValidation } from '@validation/user.validation';

/* --- Interfaces --- */
interface UpdateUserBody {
  role?: 'admin' | 'seller' | 'buyer' | 'judge' | 'mechanic';
  reputation?: number;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'seller' | 'buyer' | 'judge' | 'mechanic';
  };
}

/* --- Controller Functions --- */

/**
 * @function getMyProfile
 * @desc Retrieves the profile for the currently authenticated user.
 */
export const getMyProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'r8s7t6u5-v4w3-x2y1-z0a9-b8c7d6e5f4g3';
  try {
    const { error } = getMyProfileValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch profile');
    }
    if (user.role !== 'admin' && user.role !== 'seller' && user.role !== 'buyer' && user.role !== 'judge' && user.role !== 'mechanic') {
      throw new ForbiddenError('Invalid user role');
    }

    const userExists = await User.findById(user.id);
    if (!userExists) {
      throw new NotFoundError('User not found');
    }

    const profile: IUser | null = await User.findById(user.id).select('-password').lean();
    if (!profile) {
      throw new NotFoundError('User profile not found');
    }

    res.status(200).json(profile);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
    logger.error(`r8s7t6u5: Error fetching profile for user ${req.user?.id}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function getAllUsers
 * @desc Retrieves all users (admin only).
 */
export const getAllUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'r8s7t6u5-v4w3-x2y1-z0a9-b8c7d6e5f4g3';
  try {
    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch users');
    }
    if (user.role !== 'admin') {
      throw new ForbiddenError('Only admins may fetch all users');
    }

    const users: IUser[] = await User.find().select('-password').lean();
    res.status(200).json(users);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
    logger.error(`r8s7t6u5: Error fetching all users by admin ${req.user?.id}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function updateUserByAdmin
 * @desc Allows an admin to update a user's role or other attributes.
 */
export const updateUserByAdmin = async (req: AuthenticatedRequest<{ userId: string }, {}, UpdateUserBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'r8s7t6u5-v4w3-x2y1-z0a9-b8c7d6e5f4g3';
  try {
    const { error } = updateUserValidation.params.validate(req.params);
    const bodyError = updateUserValidation.body.validate(req.body);
    if (error || bodyError.error) {
      throw new BadRequestError(`Validation failed: ${error?.details[0].message || bodyError.error?.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to update user');
    }
    if (user.role !== 'admin') {
      throw new ForbiddenError('Only admins may update user profiles');
    }

    const { userId } = req.params;
    const userExists = await User.findById(userId);
    if (!userExists) {
      throw new NotFoundError('User not found');
    }

    const updateData = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    if (!updatedUser) {
      throw new NotFoundError('User not found for update');
    }

    res.status(200).json(updatedUser);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
    logger.error(`r8s7t6u5: Error updating user ${req.params.userId} by admin ${req.user?.id}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};
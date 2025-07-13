/**
 * © 2025 CFH, All Rights Reserved
 * File: MechanicTaskScheduler.ts
 * Path: C:\CFH\backend\controllers\mechanic\MechanicTaskScheduler.ts
 * Purpose: Assigns and tracks mechanic tasks for vehicle inspections.
 * Author: Mini Team
 * Date: 2025-07-06 [1114]
 * Version: 1.1.0
 * Version ID: a1b0c9d8-e7f6-g5h4-i3j2-k1l0m9n8o7p6
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: a1b0c9d8-e7f6-g5h4-i3j2-k1l0m9n8o7p6
 * Save Location: C:\CFH\backend\controllers\mechanic\MechanicTaskScheduler.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created interfaces (`AssignTaskBody`, `Task`, `AuthenticatedRequest`).
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 *
 * 3. Services (Suggestion) [Mini, Cod1]:
 * - Move task creation to `MechanicTaskService.ts`.
 *
 * 4. Testing (Suggestion) [Cod1]:
 * - Add unit tests for validation and controller logic.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import Vehicle from '@models/Vehicle';
import Mechanic from '@models/Mechanic';
import Task from '@models/Task';
import logger from '@utils/logger';
import { BadRequestError, InternalServerError, NotFoundError } from '@utils/errors';
import { validateAssignTask } from '@validation/mechanic.validation';

/* --- Interfaces --- */
interface AssignTaskBody {
  vehicleId: string;
  mechanicId: string;
  dueDate?: string;
}

interface Task {
  taskId: string;
  vehicleId: string;
  mechanicId: string;
  assignedAt: Date;
  dueDate: Date;
}

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

/* --- Validation Schema --- */
const taskSchema = Joi.object<AssignTaskBody>({
  vehicleId: Joi.string().hex().length(24).required(),
  mechanicId: Joi.string().hex().length(24).required(),
  dueDate: Joi.string().isoDate().optional(),
});

/* --- Controller Function --- */

/**
 * @function assignTask
 * @desc Assigns a vehicle inspection task to a mechanic.
 */
export const assignTask = async (
  req: AuthenticatedRequest<{}, {}, AssignTaskBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const ARTIFACT_ID = 'a1b0c9d8-e7f6-g5h4-i3j2-k1l0m9n8o7p6';
  try {
    const { error } = taskSchema.validate(req.body);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to assign task');
    }

    const { vehicleId, mechanicId, dueDate } = req.body;

    const [vehicle, mechanic] = await Promise.all([
      Vehicle.findById(vehicleId),
      Mechanic.findById(mechanicId),
    ]);

    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }
    if (!mechanic) {
      throw new NotFoundError('Mechanic not found');
    }

    const task: Task = {
      taskId: await Task.generateUniqueId(), // Assumes Task model has a method for unique ID
      vehicleId,
      mechanicId,
      assignedAt: new Date(),
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 86400000),
    };

    const createdTask = await Task.create(task);

    res.status(200).json({ message: 'Task scheduled successfully.', task: createdTask });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Server error during task scheduling';
    logger.error(`a1b0c9d8: Error assigning task for vehicle ${req.body.vehicleId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};
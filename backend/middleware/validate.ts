/**

© 2025 CFH, All Rights Reserved
Purpose: Validation middleware for the CFH Automotive Ecosystem
Author: CFH Dev Team
Date: 2025-06-23T12:37:00.000Z
Version: 1.0.0
Crown Certified: Yes
Batch ID: Middleware-062325
Save Location: C:\CFH\backend\middleware\validate.ts */ import { Request, Response, NextFunction } from 'express'; import { logger } from '@utils/logger';
export function validate(schema: any) {
return (req: Request, res: Response, next: NextFunction) => {
try {
if (schema) {
const { error } = schema.validate(req.body);
if (error) {
logger.warn('Validation failed', { error: error.details, timestamp: new Date().toISOString() });
return res.status(400).json({ message: error.details[0].message });
}
}
next();
} catch (err) {
const error = err as Error;
logger.error('Validation error', { error: error.message, timestamp: new Date().toISOString() });
next(error);
}
};
}

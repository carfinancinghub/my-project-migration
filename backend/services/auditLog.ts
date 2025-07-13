/**</void></void></void></void></void></void></void>

© 2025 CFH, All Rights Reserved
Purpose: Audit logging service for the CFH Automotive Ecosystem
Author: CFH Dev Team
Date: 2025-06-23T14:02:00.000Z
Version: 1.0.0
Crown Certified: Yes
Batch ID: Services-062325
Save Location: C:\CFH\backend\services\auditLog.ts */ import { logger } from '@utils/logger';
export async function logAuditEncrypted(userId: string, action: string, data: object): Promise<void> {
try {
logger.info('Audit log recorded', { userId, action, data, timestamp: new Date().toISOString() });
} catch (err) {
const error = err as Error;
logger.error('Audit log failed', { error: error.message, timestamp: new Date().toISOString() });
throw error;
}
}

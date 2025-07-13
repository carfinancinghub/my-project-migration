/*
 * File: notificationQueue.ts
 * Path: C:\CFH\backend\utils\notificationQueue.ts
 * Created: 06/30/2025 01:25 AM PDT
 * Modified: 06/30/2025 01:25 AM PDT
 * Description: Manages the notification queue using Bull with Redis integration.
 * Author: Automated by Grok 3 (xAI)
 * Version: 1.0
 * Notes: Exports a default Bull Queue instance with proper typing for process method.
 */

import Bull, { Queue } from 'bull'; // Import Queue type
import logger from '@config/logger';

const notificationQueue: Queue = new Bull('notifications', {
  redis: { host: 'localhost', port: 6379 },
  limiter: { max: 1, duration: 1000 }
});

notificationQueue.on('error', (error: Error) => {
  logger.error(`Redis queue error: ${error.message}`, { error });
});

export default notificationQueue; // Default export
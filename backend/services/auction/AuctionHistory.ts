/**
 * © 2025 CFH, All Rights Reserved
 * File: AuctionScheduler.ts
 * Path: C:\CFH\backend\services\auction\AuctionScheduler.ts
 * Purpose: Schedule auction start and end times with cron jobs
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-18 [1348]
 * Version: 1.0.1
 * Version ID: l2m3n4o5-p6q7-8901-2345-678901234567
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: l2m3n4o5-p6q7-8901-2345-678901234567
 * Save Location: C:\CFH\backend\services\auction\AuctionScheduler.ts
 */
/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Converted to TypeScript with interfaces for auction data and function types
 * - Added validation for start/end times using @validation/scheduler.validation
 * - Moved cron config to env vars for flexibility (default: '* * * * *')
 * - Suggest tests in __tests__/services/auction/AuctionScheduler.test.ts (including cron failure mocks)
 * - Added error retry mechanism for DB operations (simple 3-try retry)
 * - Improved: Added async/await consistency and typed cron callback
 * - Further: Added handling for invalid dates in validation
 */

import logger from '@utils/logger';
import * as db from '@services/db';
import cron from 'node-cron';
import AuctionManager from '@services/auction/AuctionManager';
import { schedulerValidation } from '@validation/scheduler.validation'; // Assumed Joi or similar schema

interface Auction {
  id: string;
  startTime: string;
  endTime: string;
}

// Simple retry function for DB operations
async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      logger.warn(`[AuctionScheduler] DB retry ${i + 1}/${retries}: ${err.message}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
    }
  }
  throw lastError;
}

const AuctionScheduler = {
  scheduleAuctions() {
    const cronPattern = process.env.CRON_SCHEDULE || '* * * * *';
    cron.schedule(cronPattern, async () => {
      try {
        const now = new Date();
        const pendingAuctions: Auction[] = await withRetry(() => db.getPendingAuctions());
        const activeAuctions: Auction[] = await withRetry(() => db.getActiveAuctions());

        // Start pending auctions
        for (const auction of pendingAuctions) {
          if (new Date(auction.startTime) <= now) {
            await AuctionManager.startAuction(auction.id);
            logger.info(`[AuctionScheduler] Scheduled start for auctionId: ${auction.id}`);
          }
        }
        // End active auctions
        for (const auction of activeAuctions) {
          if (new Date(auction.endTime) <= now) {
            await AuctionManager.endAuction(auction.id);
            logger.info(`[AuctionScheduler] Scheduled end for auctionId: ${auction.id}`);
          }
        }
      } catch (err: any) {
        logger.error(`[AuctionScheduler] Failed to schedule auctions: ${err.message}`, err);
      }
    });
    logger.info('[AuctionScheduler] Auction scheduling started');
  },

  async scheduleAuction(
    auctionId: string,
    startTime: string,
    endTime: string
  ): Promise<{ status: string }> {
    try {
      const auction = await withRetry(() => db.getAuction(auctionId));
      if (!auction) {
        logger.error(`[AuctionScheduler] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      // Validation using schema (e.g., Joi)
      const { error } = schedulerValidation.validate({ startTime, endTime });
      if (error) {
        throw new Error(`Invalid dates: ${error.details[0].message}`);
      }

      // Additional check for invalid dates
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date format');
      }
      if (startDate >= endDate) {
        throw new Error('Start time must be before end time');
      }

      await withRetry(() => db.updateAuction(auctionId, { startTime, endTime }));
      logger.info(
        `[AuctionScheduler] Scheduled auctionId: ${auctionId} to start at ${startTime} and end at ${endTime}`
      );
      return { status: 'scheduled' };
    } catch (err: any) {
      logger.error(
        `[AuctionScheduler] Failed to schedule auction for auctionId ${auctionId}: ${err.message}`,
        err
      );
      throw err;
    }
  },
};

export default AuctionScheduler;

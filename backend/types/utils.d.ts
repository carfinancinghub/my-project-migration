// Date: 062625 [1000], © 2025 CFH

/**
 * Generates a PDF from content
 * @module @utils/pdfGenerator
 */
declare module '@utils/pdfGenerator' {
  export function generatePDF(data: { content: string }): Promise<Buffer>;
}

/**
 * Dispatches notifications
 * @module @utils/notificationDispatcher
 */
declare module '@utils/notificationDispatcher' {
  export function dispatchNotification(to: string, message: string): Promise<void>;
}

/**
 * Schedules tasks with cron
 * @module @utils/cron
 */
declare module '@utils/cron' {
  export function scheduleTask(cronExpression: string, task: () => void): void;
}

/**
 * Axios instance for HTTP requests
 * @module @utils/axios
 */
declare module '@utils/axios' {
  import { AxiosInstance } from 'axios';
  const axiosInstance: AxiosInstance;
  export default axiosInstance;
}

/**
 * i18next instance for internationalization
 * @module @utils/i18n
 */
declare module '@utils/i18n' {
  import { i18n } from 'i18next';
  const i18nInstance: i18n;
  export default i18nInstance;
}

/**
 * WebSocket service for real-time notifications
 * @module @utils/webSocketService
 */
declare module '@utils/webSocketService' {
  export function emitToUser(userId: string, event: string, data: { message: string }): Promise<void>;
}

/**
 * Audit logger for tracking state changes
 * @module @utils/auditLogger
 */
declare module '@utils/auditLogger' {
  export function log(event: string, data: { transactionId: string; userId: string; timestamp: string }): void;
}

/**
 * Analytics service for tracking events
 * @module @utils/analytics
 */
declare module '@utils/analytics' {
  export function track(event: string, data: { userId: string; price?: number; eventType?: string; channel?: string; channels?: string[]; error?: string }): void;
}

/**
 * Notification queue for failed notifications
 * @module @utils/notificationQueue
 */
declare module '@utils/notificationQueue' {
  interface Job {
    data: { userId: string; eventType: string; message: string };
    attempts: number;
    moveToFailed: (reason: { message: string }) => Promise<void>;
    moveToCompleted: () => Promise<void>;
  }
  export function add(name: string, data: { userId: string; eventType: string; message: string }): Promise<void>;
  export function getNextJob(name: string): Promise<Job | null>;
}

/**
 * Email provider for sending notifications
 * @module @utils/emailProvider
 */
declare module '@utils/emailProvider' {
  export function send(message: string): Promise<void>;
}

/**
 * Audits escrow transactions
 * @module @services/escrow/EscrowAuditService
 */
declare module '@services/escrow/EscrowAuditService' {
  export class EscrowAuditService {
    auditTransaction(transactionId: string): Promise<{ status: string }>;
  }
}

/**
 * Syncs escrow transactions with blockchain
 * @module @services/escrow/EscrowChainSync
 */
declare module '@services/escrow/EscrowChainSync' {
  export class EscrowChainSync {
    syncTransaction(transactionId: string): Promise<{ status: string }>;
  }
}

/**
 * Generates bid heatmaps
 * @module @services/auction/BidHeatmapService
 */
declare module '@services/auction/BidHeatmapService' {
  export class BidHeatmapService {
    generateHeatmap(userId: string): Promise<{ map: number[][] }>;
  }
}

/**
 * Calculates trust scores
 * @module @services/ai/TrustScoreEngine
 */
declare module '@services/ai/TrustScoreEngine' {
  export class TrustScoreEngine {
    calculateScore(userId: string): Promise<{ score: number }>;
  }
}

/**
 * Calculates vehicle valuation metrics
 * @module @services/ai/ValuationMetricsService
 */
declare module '@services/ai/ValuationMetricsService' {
  export class ValuationMetricsService {
    calculateMetrics(vehicleId: string): Promise<{ metrics: string }>;
  }
}

/**
 * Tracks auction reputation
 * @module @controllers/AuctionReputationTracker
 */
declare module '@controllers/AuctionReputationTracker' {
  export class AuctionReputationTracker {
    calculateReputation(auctionId: string): Promise<{ score: number }>;
  }
}

/**
 * Handles notification requests
 * @module @controllers/NotificationController
 */
declare module '@controllers/NotificationController' {
  export function sendNotification(req: import('express').Request, res: import('express').Response): Promise<void>;
}

/**
 * Predicts bid outcomes
 * @module @services/ai/AIBidPredictor
 */
declare module '@services/ai/AIBidPredictor' {
  export class AIBidPredictor {
    predictBid(auctionId: string): Promise<{ prediction: string }>;
  }
}

/**
 * Recommends loans
 * @module @services/ai/AILoanRecommender
 */
declare module '@services/ai/AILoanRecommender' {
  export class AILoanRecommender {
    recommendLoan(userId: string): Promise<{ recommendation: string }>;
  }
}

/**
 * Test helpers for shared fixtures
 * @module @tests/helpers
 */
declare module '@tests/helpers' {
  import { EscrowDocument } from '@services/escrow/EscrowService';
  export function createMockTransaction(): Partial<EscrowDocument>;
}

/**
 * © 2025 CFH, All Rights Reserved
 * File: mail.ts
 * Path: C:\CFH\backend\config\mail.ts
 * Purpose: CFH Premium++ Mail Handler with Queue-Ready Stubs and validation in the CFH Automotive Ecosystem.
 * Author: CFH Dev Team (upgraded by Cod1, reviewed by Grok)
 * Date: 2025-07-15 [1432]
 * Version: 1.0.0
 * Version ID: 3r4s5t6u-7v8w-9x0y-1z2a-3b4c5d6e7f8g
 * Crown Certified: Yes (pending final test)
 * Batch ID: Compliance-071425
 * Artifact ID: 3r4s5t6u-7v8w-9x0y-1z2a-3b4c5d6e7f8g
 * Save Location: C:\CFH\backend\config\mail.ts
 * Updated By: Grok (based on Cod1 suggestions)
 * Timestamp: 2025-07-15 [1432]
 */

/*
 * Future Enhancements (Cod1):
 * - Add BullMQ or RabbitMQ queue stubs for Wow++ (Cod1, 2025-07-15 [1432]).
 */

import nodemailer from 'nodemailer';
import { z } from 'zod';
import logger from '@utils/logger'; // Alias import

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Zod schema for validation
const MailSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  text: z.string(),
  html: z.string().optional(),
});

export type MailOptions = z.infer<typeof MailSchema>;

/**
 * Send email directly or enqueue (Wow++ ready).
 * @param {MailOptions} options - Mail options (to, subject, text, html).
 */
export const sendMail = async (options: MailOptions): Promise<void> => {
  const correlationId = uuidv4();
  const result = MailSchema.safeParse(options);
  if (!result.success) {
    logger.warn('📪 Invalid mail schema', { error: result.error.format(), correlationId });
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || 'no-reply@cfh.com',
      ...result.data,
    });
    logger.info('📤 Email sent', { to: result.data.to, subject: result.data.subject, correlationId });
  } catch (error) {
    logger.error('📭 Email send failed', { error, to: result.data.to, subject: result.data.subject, correlationId });
  }
};

// Stub for BullMQ queue integration (Wow++)
export const enqueueMail = async (mail: MailOptions): Promise<void> => {
  const correlationId = uuidv4();
  // Placeholder for Bull integration
  logger.info('[Queue:MAIL] Stub enqueued mail', { mail, correlationId });
};

// Premium/Wow++ Note: Add premium delivery with safety, observability, queueing for high-volume (Bull).

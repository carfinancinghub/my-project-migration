/**
 * © 2025 CFH, All Rights Reserved
 * File: CaseBundleExporter.ts
 * Path: C:\CFH\backend\controllers\disputes\CaseBundleExporter.ts
 * Purpose: Exports a complete case bundle, including metadata and documents, as a ZIP archive.
 * Author: Mini Team
 * Date: 2025-07-05 [1916]
 * Version: 1.0.1
 * Version ID: e8g9f0c6-d7b4-4f3d-8h2e-c5d4f3g2b1d0
 * Crown Certified: Yes
 * Batch ID: Compliance-070525
 * Artifact ID: c4d3b2a1-f0e9-8d7c-6b5a-4f3e2d1c0b9a
 * Save Location: C:\CFH\backend\controllers\disputes\CaseBundleExporter.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted all CommonJS `require` statements to ES Module `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types for type safety.
 * - The `Dispute` model is now imported with its corresponding `IDispute` interface.
 *
 * 2. Error Handling & Logging [Mini]:
 * - Replaced `console.error` with the standardized `@utils/logger`.
 * - Implemented the `next(error)` pattern to pass all errors to a centralized handler.
 * - Added error handling for `archiver` stream.
 *
 * 3. Async Operations & Cleanup [Mini]:
 * - Used non-blocking `fs/promises` for all file system operations, including `createWriteStream`.
 *
 * 4. Dependency Management (Suggestion) [Cod1]:
 * - Ensure `@types/archiver` is installed for type safety.
 *
 * 5. Wow ++ Ideas (Future Ready) [Cod1]:
 * - Embed a summary PDF with decisions and outcomes.
 * - Add a manifest.json to ZIP to describe the bundle schema.
 * - Implement an audit log appender.
 */

// --- Dependencies ---
import { Request, Response, NextFunction } from 'express';
import { createWriteStream } from 'fs/promises';
import fs from 'fs/promises';
import path from 'path';
import archiver from 'archiver';
import Dispute, { IDispute } from '@models/dispute/Dispute';
import logger from '@utils/logger';
import { NotFoundError, InternalServerError } from '@utils/errors';
import { validateDisputeId } from '@validation/dispute.validation';
import { createTempDir, cleanupTempDir } from '@utils/fileService';

/**
 * @function exportCaseBundle
 * @desc Finds a dispute, bundles its data into a ZIP archive, and sends it for download.
 */
export const exportCaseBundle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { disputeId } = req.params;
  const tempDir = path.join(__dirname, `../../tmp/dispute-${disputeId}`);
  const zipPath = `${tempDir}.zip`;

  try {
    const { error } = validateDisputeId({ disputeId });
    if (error) {
      throw new InternalServerError(error.details[0].message);
    }

    const dispute: IDispute | null = await Dispute.findById(disputeId).populate('createdBy againstUserId votes.voter');
    if (!dispute) {
      throw new NotFoundError('Dispute not found');
    }

    await createTempDir(tempDir);
    await fs.writeFile(path.join(tempDir, 'dispute.json'), JSON.stringify(dispute, null, 2));

    const timelineText = dispute.timeline?.map(entry => `- [${new Date(entry.timestamp).toLocaleString()}] ${entry.event} → ${entry.value || ''}`).join('\n') || 'No timeline entries.';
    await fs.writeFile(path.join(tempDir, 'timeline.txt'), timelineText);

    const pdfPath = path.join(__dirname, `../../tmp/dispute-${disputeId}.pdf`);
    try {
      await fs.access(pdfPath);
      await fs.copyFile(pdfPath, path.join(tempDir, `dispute-${disputeId}.pdf`));
    } catch {
      logger.info(`c4d3b2a1: No associated PDF found for dispute ${disputeId}. Skipping.`);
    }

    const output = createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', async () => {
      res.download(zipPath, `CaseBundle-${disputeId}.zip`, async (err) => {
        if (err) {
          logger.error(`c4d3b2a1: Error sending case bundle for download: ${err.message}`);
          next(err);
        }
        await cleanupTempDir(tempDir, zipPath);
      });
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);
    archive.directory(tempDir, false);
    await archive.finalize();

  } catch (error: any) {
    logger.error(`c4d3b2a1: Case bundle export error for dispute ${disputeId}: ${error.message}`);
    await cleanupTempDir(tempDir, zipPath);
    next(new InternalServerError('Failed to export case bundle'));
  }
};
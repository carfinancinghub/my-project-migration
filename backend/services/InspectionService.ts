/**
 * © 2025 CFH, All Rights Reserved
 * File: InspectionService.ts
 * Path: C:\CFH\backend\services\InspectionService.ts
 * Purpose: Handles the business logic for creating, retrieving, and managing inspection jobs and reports.
 * Author: Mini Team, Cod1, Grok
 * Date: 2025-07-07 [2010]
 * Version: 1.0.0
 * Version ID: a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6
 * Save Location: C:\CFH\backend\services\InspectionService.ts
 */

/*
 * --- Side Note: Implementation Details ---
 *
 * 1. Separation of Concerns [Grok]:
 * - Abstracts all database interactions for inspections.
 *
 * 2. Existence Checks [Grok]:
 * - Performs checks on `reportId`, `jobId`, `vehicle`, `mechanic`.
 *
 * 3. Authorization [Grok]:
 * - Includes ownership check for `submitInspectionReport`.
 */

import Inspection, { IInspection } from '@models/Inspection';
import User from '@models/User';
import Car from '@models/Car';
import { NotFoundError, ForbiddenError } from '@utils/errors';

export class InspectionService {
  public async getInspectionReportById(reportId: string): Promise<IInspection> {
    const report = await Inspection.findById(reportId).populate('mechanic vehicle buyer').lean();
    if (!report) throw new NotFoundError('Inspection report not found');
    return report;
  }

  public async getInspectionJobsForMechanic(mechanicId: string): Promise<IInspection[]> {
    const mechanicExists = await User.findById(mechanicId);
    if (!mechanicExists) throw new NotFoundError('Mechanic not found');
    return Inspection.find({ mechanic: mechanicId }).populate('vehicle').lean();
  }

  public async createInspectionJob(data: { vehicle: string; scheduledDate: Date; mechanic: string }): Promise<IInspection> {
    const { vehicle, scheduledDate, mechanic } = data;
    const [vehicleExists, mechanicExists] = await Promise.all([
      Car.findById(vehicle),
      User.findById(mechanic),
    ]);

    if (!vehicleExists) throw new NotFoundError('Vehicle not found');
    if (!mechanicExists) throw new NotFoundError('Mechanic not found');

    const newJob = new Inspection({ vehicle, scheduledDate, mechanic });
    return newJob.save();
  }

  public async submitInspectionReport(jobId: string, userId: string, data: { condition: string; notes?: string; issuesFound?: string[]; photoUrls?: string[]; voiceNotes?: string[] }): Promise<IInspection> {
    const job = await Inspection.findById(jobId);
    if (!job) throw new NotFoundError('Inspection job not found');
    if (job.mechanic.toString() !== userId) throw new ForbiddenError('User is not authorized to submit this report');

    job.condition = data.condition;
    job.notes = data.notes || '';
    job.issuesFound = data.issuesFound || [];
    job.photoUrls = data.photoUrls || [];
    job.voiceNotes = data.voiceNotes || [];
    job.completedAt = new Date();
    job.status = 'Completed';

    return job.save();
  }

  public async getAllInspectionReports(): Promise<IInspection[]> {
    return Inspection.find().populate('vehicle mechanic buyer').lean();
  }
}
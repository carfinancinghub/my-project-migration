/*
File: JobTrackingView.tsx
Path: C:\CFH\frontend\src\components\body-shop\JobTrackingView.tsx
Created: 2025-07-04 10:30 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Component for tracking repair jobs with tiered features.
Artifact ID: q6r7s8t9-u0v1-w2x3-y4z5-a6b7c8d9e0f1
Version ID: r7s8t9u0-v1w2-x3y4-z5a6-b7c8d9e0f1g2
*/

import React, { useState, useEffect, useCallback } from 'react';
import logger from '@/utils/logger'; // Centralized logging utility
import { toast } from '@/utils/toast'; // Assuming a toast notification utility
import { jobService } from '@/services/jobService'; // API service for fetching job data
// Cod1+ TODO: Import for Gamified Progress Bar
// import { GamifiedProgressBar } from '@/components/common/GamifiedProgressBar';
// Cod1+ TODO: Import for AI Predictive Delay Alerts
// import { AIPredictiveDelayAlert } from '@/components/ai/AIPredictiveDelayAlert';
// Cod1+ TODO: Import for Digital Documents Viewer
// import { DocumentViewer } from '@/components/common/DocumentViewer';

// Define types for Job Data
interface JobMilestone {
    name: string;
    completed: boolean;
    timestamp?: string; // When completed
    notes?: string;
}

interface CommunicationLogEntry {
    id: string;
    type: 'message' | 'call' | 'email';
    content: string;
    timestamp: string;
    direction: 'inbound' | 'outbound';
}

interface JobData {
    jobId: string;
    vehicle: {
        make: string;
        model: string;
        vin: string;
    };
    shop: {
        id: string;
        name: string;
        phone: string;
        email: string;
    };
    status: 'Scheduled' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
    basicMilestones: JobMilestone[]; // Free Tier
    estimatedCompletionDate?: string; // Standard Tier
    communicationLog?: CommunicationLogEntry[]; // Standard Tier
    jobHistory?: any[]; // Standard Tier (e.g., past statuses)
    progressUpdates?: { percentage: number; photos?: string[]; videos?: string[]; timestamp: string; technicianNotes?: string; }[]; // Premium Tier
    digitalDocuments?: { id: string; name: string; url: string; type: string; }[]; // Premium Tier
    predictedDelay?: { isDelayed: boolean; reason?: string; newETA?: string; } // Wow++ AI predictive delay
    gamificationProgress?: { currentPoints: number; nextRewardPoints: number; level: string; } // Wow++ gamified progress
    insuranceUpdateStatus?: string; // Wow++
}

interface JobTrackingViewProps {
    jobId: string;
    userTier: 'free' | 'standard' | 'premium' | 'wowplus';
    userId?: string; // For audit logging, personalized interactions
}

const JobTrackingView: React.FC<JobTrackingViewProps> = ({ jobId, userTier, userId }) => {
    const [job, setJob] = useState<JobData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // CQS: Audit logging on component render
    useEffect(() => {
        logger.info(`Rendering JobTrackingView for job ${jobId}, user ${userId}, tier: ${userTier}`);
        // CQS: RBAC for Premium/Wow++ - assumed handled by backend API calls and data filtering
        // CQS: Data encryption for Premium/Wow++ - assumed handled by backend services.
    }, [jobId, userId, userTier]);

    // Data fetching with retry logic and tier-specific data retrieval
    const fetchJobData = useCallback(async (id: string, currentTier: string, retryCount = 0) => {
        const MAX_RETRIES = 3;
        const RETRY_DELAY_MS = 1000;

        setLoading(true);
        setError(null);
        setJob(null); // Clear previous data

        try {
            const startTime = performance.now(); // CQS: <2s load for Free, <1s for Wow++

            // Cod1+ TODO: Call jobService to fetch job data based on tier
            // const response = await jobService.getJobDetails(id, userId, currentTier);

            // --- Mock Data Generation based on Tier ---
            const baseJob: JobData = {
                jobId: id,
                vehicle: { make: 'Honda', model: 'Civic', vin: 'JOBVIN123456789' },
                shop: { id: 'shop1', name: 'Elite Auto Repair', phone: '(916) 555-1234', email: 'shop@elite.com' },
                status: 'In Progress',
                basicMilestones: [
                    { name: 'Scheduled', completed: true, timestamp: '2025-07-01T09:00:00Z' },
                    { name: 'Vehicle Received', completed: true, timestamp: '2025-07-01T10:00:00Z' },
                    { name: 'In Progress', completed: true, timestamp: '2025-07-02T09:00:00Z' },
                    { name: 'Quality Check', completed: false },
                    { name: 'Ready for Pickup', completed: false },
                    { name: 'Completed', completed: false },
                ],
                estimatedCompletionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
                communicationLog: [
                    { id: 'comm1', type: 'message', content: 'Job started.', timestamp: '2025-07-02T09:30:00Z', direction: 'outbound' },
                    { id: 'comm2', type: 'call', content: 'Customer called for update.', timestamp: '2025-07-02T11:00:00Z', direction: 'inbound' },
                ],
                jobHistory: [{ status: 'Scheduled', timestamp: '2025-07-01' }],
                progressUpdates: [
                    { percentage: 25, technicianNotes: 'Parts ordered.', timestamp: '2025-07-02T14:00:00Z' },
                    { percentage: 50, photos: ['https://placehold.co/100x100?text=Progress+Photo'], timestamp: '2025-07-03T10:00:00Z' },
                ],
                digitalDocuments: [
                    { id: 'doc1', name: 'Initial Estimate', url: 'https://placehold.co/100x100?text=Estimate.pdf', type: 'pdf' },
                ],
                predictedDelay: { isDelayed: false },
                gamificationProgress: { currentPoints: 75, nextRewardPoints: 100, level: 'Apprentice' },
                insuranceUpdateStatus: 'Claim status updated to "Approved".',
            };

            let currentJob: JobData = { ...baseJob };

            if (currentTier === 'free') {
                delete currentJob.estimatedCompletionDate;
                delete currentJob.communicationLog;
                delete currentJob.jobHistory;
                delete currentJob.progressUpdates;
                delete currentJob.digitalDocuments;
                delete currentJob.predictedDelay;
                delete currentJob.gamificationProgress;
                delete currentJob.insuranceUpdateStatus;
            } else if (currentTier === 'standard') {
                delete currentJob.progressUpdates;
                delete currentJob.digitalDocuments;
                delete currentJob.predictedDelay;
                delete currentJob.gamificationProgress;
                delete currentJob.insuranceUpdateStatus;
            } else if (currentTier === 'premium') {
                // Premium gets everything except Wow++ specific features
                delete currentJob.predictedDelay;
                delete currentJob.gamificationProgress;
                delete currentJob.insuranceUpdateStatus;
            }
            // Wow++ gets all data

            // Simulate API call latency
            await new Promise(resolve => setTimeout(resolve, 300));

            setJob(currentJob);

            const endTime = performance.now();
            const loadTimeMs = endTime - startTime;
            const threshold = userTier === 'wowplus' ? 1000 : 2000; // CQS: <1s for Wow++, <2s for Free
            if (loadTimeMs > threshold) {
                logger.warn(`JobTrackingView load time exceeded ${threshold}ms: ${loadTimeMs.toFixed(2)}ms for job ${jobId}, tier ${currentTier}`);
            }

        } catch (err: any) {
            logger.error(`Failed to load job data for ${jobId} (attempt ${retryCount + 1}/${MAX_RETRIES}):`, err);
            if (retryCount < MAX_RETRIES - 1) {
                setError(`Failed to load job data. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
                setTimeout(() => fetchJobData(id, currentTier, retryCount + 1), RETRY_DELAY_MS);
            } else {
                setError(err.response?.data?.message || 'Failed to load job data after multiple attempts.');
                toast.error(err.response?.data?.message || 'Failed to load job data.', { position: 'top-right' });
                // Error Handling: Handle "No updates available" (Standard), delayed updates (Wow++)
                if (err.response?.status === 404) {
                    toast.info("No job updates available.");
                } else if (currentTier === 'wowplus' && err.message.includes('delayed')) {
                    toast.warn("Real-time updates are currently delayed.");
                }
            }
        } finally {
            if (retryCount >= MAX_RETRIES - 1 || error === null) {
                setLoading(false);
            }
        }
    }, [jobId, userTier, userId, error]);

    useEffect(() => {
        if (jobId) {
            fetchJobData(jobId, userTier);
        } else {
            setLoading(false);
            setError("Job ID is required to track job progress.");
        }
    }, [jobId, userTier, fetchJobData]);


    if (loading) return <div className="text-center p-4" aria-live="polite">Loading job progress...</div>;
    if (error) return <div className="text-center p-4 text-red-600" role="alert">Error: {error}</div>;
    if (!job) return <div className="text-center p-4 text-gray-500">No job data available for this ID.</div>;

    // CQS: Accessibility (WCAG 2.1 AA with keyboard navigation, ARIA)
    return (
        <div className="job-tracking-view p-4 bg-white rounded-lg shadow-md" aria-label={`Job tracking view for ${job.vehicle.make} ${job.vehicle.model} (${job.jobId})`}>
            <h1 className="text-2xl font-bold mb-4" aria-level={1}>Job Tracking: {job.vehicle.make} {job.vehicle.model}</h1>
            <p className="text-sm text-gray-600 mb-4">Job ID: {job.jobId} | Status: <span className="font-semibold">{job.status}</span></p>

            {/* Free Tier: Basic Milestones, Notifications, Shop Contact */}
            <section className="mb-6">
                <h2 className="text-lg font-semibold mb-2" aria-level={2}>Job Milestones</h2>
                <ol className="list-decimal pl-5" aria-label="Job milestones">
                    {job.basicMilestones.map((milestone, index) => (
                        <li key={index} className={`text-sm ${milestone.completed ? 'text-green-700 font-medium' : 'text-gray-500'}`} role="listitem">
                            {milestone.name} {milestone.completed && `(Completed: ${new Date(milestone.timestamp!).toLocaleDateString()})`}
                        </li>
                    ))}
                </ol>
                <div className="mt-4">
                    <p className="text-sm text-gray-700">Notifications: Email and in-app updates enabled.</p>
                    <p className="text-sm text-gray-700">Contact Shop: <a href={`tel:${job.shop.phone}`} className="text-blue-600 hover:underline">{job.shop.name} ({job.shop.phone})</a></p>
                </div>
            </section>

            {/* Standard Tier: Job Status Timeline, Estimated Completion, Communication Log, Job History */}
            {(userTier === 'standard' || userTier === 'premium' || userTier === 'wowplus') && (
                <section className="mb-6">
                    <h2 className="text-lg font-semibold mb-2" aria-level={2}>Job Status Timeline</h2>
                    {job.estimatedCompletionDate && (
                        <p className="text-md font-medium text-blue-700 mb-3" aria-label={`Estimated completion date: ${new Date(job.estimatedCompletionDate).toLocaleDateString()}`}>
                            Estimated Completion: {new Date(job.estimatedCompletionDate).toLocaleDateString()}
                        </p>
                    )}
                    {job.communicationLog && job.communicationLog.length > 0 ? (
                        <div className="border rounded-md p-3 bg-gray-50 max-h-60 overflow-y-auto" aria-label="Communication log">
                            <h3 className="text-md font-medium mb-2">Communication Log</h3>
                            {job.communicationLog.map((log, index) => (
                                <p key={index} className="text-sm text-gray-700 mb-1" role="listitem">
                                    [{new Date(log.timestamp).toLocaleTimeString()}] ({log.direction === 'inbound' ? 'From Customer' : 'To Customer'}): {log.content}
                                </p>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No communication log available.</p>
                    )}
                    {job.jobHistory && job.jobHistory.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-md font-medium mb-2">Job History</h3>
                            <ul className="list-disc pl-5 text-sm text-gray-700" aria-label="Job status history">
                                {job.jobHistory.map((history, index) => (
                                    <li key={index} role="listitem">{history.status} on {new Date(history.timestamp).toLocaleDateString()}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {/* Cod1+ TODO: Handle "No updates available" (Standard) */}
                </section>
            )}

            {/* Premium Tier: Real-time Updates, Photo/Video Progress, Direct Technician Line, Refined ETA, Digital Documents */}
            {(userTier === 'premium' || userTier === 'wowplus') && (
                <section className="mb-6">
                    <h2 className="text-lg font-semibold mb-2" aria-level={2}>Premium Progress Tracking</h2>
                    <p className="text-sm text-blue-700 font-medium mb-3">Real-time updates are enabled for this job.</p>
                    {job.progressUpdates && job.progressUpdates.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {job.progressUpdates.map((update, index) => (
                                <div key={index} className="border rounded-md p-3 bg-blue-50" role="listitem">
                                    <p className="font-medium">Progress: {update.percentage}%</p>
                                    {update.technicianNotes && <p className="text-sm text-gray-700">Notes: {update.technicianNotes}</p>}
                                    {update.photos && update.photos.length > 0 && (
                                        <div className="flex space-x-2 mt-2" aria-label="Progress photos">
                                            {update.photos.map((photo, pIdx) => <img key={pIdx} src={photo} alt={`Progress photo ${pIdx + 1}`} className="w-16 h-16 object-cover rounded-md" />)}
                                        </div>
                                    )}
                                    {/* TODO: Add video previews */}
                                    <p className="text-xs text-gray-500 mt-1">{new Date(update.timestamp).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No detailed progress updates available.</p>
                    )}
                    {job.digitalDocuments && job.digitalDocuments.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-md font-medium mb-2">Digital Documents</h3>
                            <ul className="list-disc pl-5 text-sm text-blue-700" aria-label="Digital documents related to the job">
                                {job.digitalDocuments.map((doc, index) => (
                                    <li key={index} role="listitem"><a href={doc.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{doc.name} ({doc.type})</a></li>
                                ))}
                            </ul>
                            {/* Cod1+ TODO: Integrate DocumentViewer */}
                            {/* <DocumentViewer documents={job.digitalDocuments} /> */}
                        </div>
                    )}
                    <button className="btn btn-sm mt-4">Direct Message Technician</button>
                    <p className="text-sm text-gray-700 mt-4">Refined ETA: {job.estimatedCompletionDate ? new Date(job.estimatedCompletionDate).toLocaleDateString() : 'N/A'}</p>
                </section>
            )}

            {/* Wow++ Tier: Gamified Progress, "Your Car’s Journey" Story, AI Predictive Delay Alerts, Insurance Update, "Repair Hero" Badge */}
            {userTier === 'wowplus' && (
                <section className="mb-6">
                    <h2 className="text-lg font-semibold mb-2" aria-level={2}>Wow++ Intelligent Job Management</h2>
                    {job.gamificationProgress && (
                        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <h3 className="font-semibold text-purple-800 mb-2">Gamified Progress</h3>
                            <p className="text-sm text-purple-700">Current Level: {job.gamificationProgress.level}</p>
                            {/* Cod1+ TODO: Integrate GamifiedProgressBar */}
                            {/* <GamifiedProgressBar currentPoints={job.gamificationProgress.currentPoints} nextRewardPoints={job.gamificationProgress.nextRewardPoints} /> */}
                            <p className="text-sm text-purple-700 mt-2">Points: {job.gamificationProgress.currentPoints} / {job.gamificationProgress.nextRewardPoints}</p>
                            <p className="text-sm text-purple-700 mt-2">Earn the "Repair Hero" badge by completing your job!</p>
                        </div>
                    )}
                    {/* Cod1+ TODO: Integrate "Your Car's Journey" Story (e.g., a timeline component with rich media) */}
                    <button className="btn btn-sm mt-4 bg-indigo-600 text-white hover:bg-indigo-700">View Your Car's Journey</button>

                    {job.predictedDelay && (
                        // Cod1+ TODO: Integrate AIPredictiveDelayAlert
                        // <AIPredictiveDelayAlert delayInfo={job.predictedDelay} />
                        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200" role="alert">
                            <h3 className="font-semibold text-red-800 mb-2">AI Predictive Delay Alert!</h3>
                            {job.predictedDelay.isDelayed ? (
                                <p className="text-sm text-red-700">
                                    **Potential Delay Detected**: {job.predictedDelay.reason || 'Reason unknown'}. New Estimated Completion: {job.predictedDelay.newETA ? new Date(job.predictedDelay.newETA).toLocaleDateString() : 'N/A'}.
                                </p>
                            ) : (
                                <p className="text-sm text-green-700">No significant delays predicted for your job.</p>
                            )}
                            {/* Cod1+ TODO: Handle "delayed updates" (Wow++) */}
                        </div>
                    )}
                    {job.insuranceUpdateStatus && (
                        <div className="mt-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
                            <h3 className="font-semibold text-teal-800 mb-2">Insurance Update</h3>
                            <p className="text-sm text-teal-700">{job.insuranceUpdateStatus}</p>
                            {/* Cod1+ TODO: Integrate with insurance update service */}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

export default JobTrackingView;
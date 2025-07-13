/*
File: JobTrackingView.test.tsx
Path: C:\CFH\frontend\tests\components\body-shop\JobTrackingView.test.tsx
Created: 2025-07-04 11:40 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest test file for JobTrackingView component with tiered features and accessibility checks.
Artifact ID: s1t2u3v4-w5x6-y7z8-a9b0-c1d2e3f4g5h6
Version ID: t2u3v4w5-x6y7-z8a9-b0c1-d2e3f4g5h6i7
*/

import React from 'react';
import { render, screen, waitFor, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe'; // For accessibility testing

// Extend Jest with jest-axe matchers
expect.extend(toHaveNoViolations);

import JobTrackingView from '@/components/body-shop/JobTrackingView';
import { jobService } from '@/services/jobService'; // Mock the API service
import logger from '@/utils/logger'; // Mock logger
import { toast } from '@/utils/toast'; // Mock toast notifications

// Mock external dependencies
jest.mock('@/services/jobService', () => ({
    jobService: {
        getJobDetails: jest.fn(),
    },
}));
jest.mock('@/utils/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}));
jest.mock('@/utils/toast', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
    },
}));

// Mock child components if they have complex rendering or API calls
jest.mock('@/components/common/GamifiedProgressBar', () => ({
    GamifiedProgressBar: ({ currentPoints, nextRewardPoints }: any) => (
        <div data-testid="mock-gamified-progress-bar">
            Progress: {currentPoints}/{nextRewardPoints}
        </div>
    ),
}));
jest.mock('@/components/ai/AIPredictiveDelayAlert', () => ({
    AIPredictiveDelayAlert: ({ delayInfo }: any) => (
        <div data-testid="mock-ai-delay-alert">
            AI Delay: {delayInfo.isDelayed ? 'Delayed' : 'On Time'}
        </div>
    ),
}));
jest.mock('@/components/common/DocumentViewer', () => ({
    DocumentViewer: ({ documents }: any) => (
        <div data-testid="mock-document-viewer">
            Mock Document Viewer ({documents.length} docs)
        </div>
    ),
}));


describe('JobTrackingView', () => {
    const mockJobId = 'job123';
    const baseMockJobData = {
        jobId: mockJobId,
        vehicle: { make: 'Honda', model: 'Civic', vin: 'JOBVIN123456789' },
        shop: { id: 'shop1', name: 'Elite Auto Repair', phone: '(916) 555-1234', email: 'shop@elite.com' },
        status: 'In Progress' as 'In Progress',
        basicMilestones: [
            { name: 'Scheduled', completed: true, timestamp: '2025-07-01T09:00:00Z' },
            { name: 'Vehicle Received', completed: true, timestamp: '2025-07-01T10:00:00Z' },
            { name: 'In Progress', completed: true, timestamp: '2025-07-02T09:00:00Z' },
            { name: 'Quality Check', completed: false },
        ],
    };

    beforeEach(() => {
        cleanup(); // Clean up DOM after each test
        jest.clearAllMocks(); // Clear mock calls
        // Set default mock implementation for getJobDetails
        (jobService.getJobDetails as jest.Mock).mockResolvedValue({ data: baseMockJobData });
    });

    // --- Initial Loading and Error States ---
    it('renders loading state initially', () => {
        (jobService.getJobDetails as jest.Mock).mockReturnValueOnce(new Promise(() => {})); // Never resolve
        render(<JobTrackingView jobId={mockJobId} userTier="free" />);
        expect(screen.getByText('Loading job progress...')).toBeInTheDocument();
    });

    it('displays error if jobId is missing', async () => {
        render(<JobTrackingView jobId={''} userTier="free" />);
        await waitFor(() => {
            expect(screen.getByText('Job ID is required to track job progress.')).toBeInTheDocument();
        });
        expect(jobService.getJobDetails).not.toHaveBeenCalled();
    });

    it('displays error message on API failure', async () => {
        (jobService.getJobDetails as jest.Mock).mockRejectedValueOnce({ response: { data: { message: 'Network error' } } });
        render(<JobTrackingView jobId={mockJobId} userTier="free" />);
        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
            expect(screen.getByText('Error: Network error')).toBeInTheDocument();
        });
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to load job data'), expect.any(Object));
        expect(toast.error).toHaveBeenCalledWith('Network error', expect.any(Object));
    });

    it('displays "No job data available" if API returns null data', async () => {
        (jobService.getJobDetails as jest.Mock).mockResolvedValueOnce({ data: null });
        render(<JobTrackingView jobId={mockJobId} userTier="free" />);
        await waitFor(() => {
            expect(screen.getByText('No job data available for this ID.')).toBeInTheDocument();
        });
    });

    // --- Free Tier Tests ---
    describe('Free Tier Functionality', () => {
        const freeTierData = {
            ...baseMockJobData,
            basicMilestones: [
                { name: 'Scheduled', completed: true, timestamp: '2025-07-01T09:00:00Z' },
                { name: 'Vehicle Received', completed: true, timestamp: '2025-07-01T10:00:00Z' },
                { name: 'In Progress', completed: false },
            ],
        };

        beforeEach(() => {
            (jobService.getJobDetails as jest.Mock).mockResolvedValue({ data: freeTierData });
        });

        it('renders basic milestones and shop contact for Free tier', async () => {
            render(<JobTrackingView jobId={mockJobId} userTier="free" />);
            await waitFor(() => {
                expect(screen.getByText(`Job Tracking: ${freeTierData.vehicle.make} ${freeTierData.vehicle.model}`)).toBeInTheDocument();
                expect(screen.getByText('Job Milestones')).toBeInTheDocument();
                expect(screen.getByText('Scheduled (Completed:')).toBeInTheDocument();
                expect(screen.getByText('In Progress')).toBeInTheDocument();
                expect(screen.getByText('Notifications: Email and in-app updates enabled.')).toBeInTheDocument();
                expect(screen.getByText(`Contact Shop: ${freeTierData.shop.name} (${freeTierData.shop.phone})`)).toBeInTheDocument();
            });
            expect(jobService.getJobDetails).toHaveBeenCalledWith(mockJobId, 'free');
        });
    });

    // --- Standard Tier Tests ---
    describe('Standard Tier Functionality', () => {
        const standardTierData = {
            ...baseMockJobData,
            estimatedCompletionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            communicationLog: [
                { id: 'comm1', type: 'message', content: 'Job started.', timestamp: '2025-07-02T09:30:00Z', direction: 'outbound' },
            ],
            jobHistory: [
                { status: 'Scheduled', timestamp: '2025-07-01' },
            ],
        };

        beforeEach(() => {
            (jobService.getJobDetails as jest.Mock).mockResolvedValue({ data: standardTierData });
        });

        it('renders timeline and communication log for Standard tier', async () => {
            render(<JobTrackingView jobId={mockJobId} userTier="standard" />);
            await waitFor(() => {
                expect(screen.getByText('Job Status Timeline')).toBeInTheDocument();
                expect(screen.getByText(`Estimated Completion: ${new Date(standardTierData.estimatedCompletionDate!).toLocaleDateString()}`)).toBeInTheDocument();
                expect(screen.getByText('Communication Log')).toBeInTheDocument();
                expect(screen.getByText('Job History')).toBeInTheDocument();
                expect(screen.getByText(/Job started./i)).toBeInTheDocument();
            });
            expect(jobService.getJobDetails).toHaveBeenCalledWith(mockJobId, 'standard');
        });

        it('displays "No communication log available" if log is empty', async () => {
            const noLogData = { ...standardTierData, communicationLog: [] };
            (jobService.getJobDetails as jest.Mock).mockResolvedValue({ data: noLogData });
            render(<JobTrackingView jobId={mockJobId} userTier="standard" />);
            await waitFor(() => {
                expect(screen.getByText('No communication log available.')).toBeInTheDocument();
            });
        });
    });

    // --- Premium Tier Tests ---
    describe('Premium Tier Functionality', () => {
        const premiumTierData = {
            ...baseMockJobData,
            progressUpdates: [
                { percentage: 25, technicianNotes: 'Parts ordered.', timestamp: '2025-07-02T14:00:00Z' },
                { percentage: 50, photos: ['https://placehold.co/100x100?text=Progress+Photo'], timestamp: '2025-07-03T10:00:00Z' },
            ],
            digitalDocuments: [
                { id: 'doc1', name: 'Initial Estimate', url: 'https://placehold.co/100x100?text=Estimate.pdf', type: 'pdf' },
            ],
        };

        beforeEach(() => {
            (jobService.getJobDetails as jest.Mock).mockResolvedValue({ data: premiumTierData });
        });

        it('renders real-time updates and digital documents for Premium tier', async () => {
            render(<JobTrackingView jobId={mockJobId} userTier="premium" />);
            await waitFor(() => {
                expect(screen.getByText('Premium Progress Tracking')).toBeInTheDocument();
                expect(screen.getByText('Real-time updates are enabled for this job.')).toBeInTheDocument();
                expect(screen.getByText('Progress: 25%')).toBeInTheDocument();
                expect(screen.getByText('Digital Documents')).toBeInTheDocument();
                expect(screen.getByText('Initial Estimate (pdf)')).toBeInTheDocument();
                expect(screen.getByText('Direct Message Technician')).toBeInTheDocument();
            });
            expect(jobService.getJobDetails).toHaveBeenCalledWith(mockJobId, 'premium');
        });
    });

    // --- Wow++ Tier Tests ---
    describe('Wow++ Tier Functionality', () => {
        const wowPlusTierData = {
            ...baseMockJobData,
            gamificationProgress: { currentPoints: 75, nextRewardPoints: 100, level: 'Apprentice' },
            predictedDelay: { isDelayed: true, reason: 'Parts delay', newETA: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString() },
            insuranceUpdateStatus: 'Claim status updated to "Approved".',
        };

        beforeEach(() => {
            (jobService.getJobDetails as jest.Mock).mockResolvedValue({ data: wowPlusTierData });
        });

        it('renders gamified progress, AI alerts, and insurance updates for Wow++ tier', async () => {
            render(<JobTrackingView jobId={mockJobId} userTier="wowplus" />);
            await waitFor(() => {
                expect(screen.getByText('Wow++ Intelligent Job Management')).toBeInTheDocument();
                expect(screen.getByText('Gamified Progress')).toBeInTheDocument();
                expect(screen.getByText('Progress: 75/100')).toBeInTheDocument(); // From mock ChartWidget
                expect(screen.getByText('AI Predictive Delay Alert!')).toBeInTheDocument();
                expect(screen.getByText('Insurance Update')).toBeInTheDocument();
                expect(screen.getByText('Claim status updated to "Approved".')).toBeInTheDocument();
            });
            expect(jobService.getJobDetails).toHaveBeenCalledWith(mockJobId, 'wowplus');
        });

        it('displays "No significant delays predicted" when AI predicts no delay', async () => {
            const noDelayData = { ...wowPlusTierData, predictedDelay: { isDelayed: false } };
            (jobService.getJobDetails as jest.Mock).mockResolvedValue({ data: noDelayData });
            render(<JobTrackingView jobId={mockJobId} userTier="wowplus" />);
            await waitFor(() => {
                expect(screen.getByText('No significant delays predicted for your job.')).toBeInTheDocument();
            });
        });
    });

    // --- Accessibility Tests (Jest-Axe) ---
    it('should have no accessibility violations for Free tier', async () => {
        (jobService.getJobDetails as jest.Mock).mockResolvedValue({ data: baseMockJobData });
        const { container } = render(<JobTrackingView jobId={mockJobId} userTier="free" />);
        await waitFor(() => expect(screen.getByText('Job Milestones')).toBeInTheDocument());
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations for Wow++ tier', async () => {
        (jobService.getJobDetails as jest.Mock).mockResolvedValue({ data: { ...baseMockJobData, ...{ gamificationProgress: { currentPoints: 50, nextRewardPoints: 100, level: 'Expert' }, predictedDelay: { isDelayed: false }, insuranceUpdateStatus: 'Approved' } } });
        const { container } = render(<JobTrackingView jobId={mockJobId} userTier="wowplus" />);
        await waitFor(() => expect(screen.getByText('Wow++ Intelligent Job Management')).toBeInTheDocument());
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
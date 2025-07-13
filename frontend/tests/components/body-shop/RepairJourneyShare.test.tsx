/*
File: RepairJourneyShare.test.tsx
Path: C:\CFH\frontend\tests\components\body-shop\RepairJourneyShare.test.tsx
Created: 2025-07-05 11:35 AM PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest test file for RepairJourneyShare with RTL and accessibility checks.
Artifact ID: l1m2n3o4-p5q6-r7s8-t9u0-v1w2x3y4z5a6
Version ID: m2n3o4p5-q6r7-s8t9-u0v1-w2x3y4z5a6b7 // New unique ID for version 1.0
*/

import React from 'react';
import { render, screen, waitFor, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'; // For extended matchers like toBeInTheDocument
import { axe, toHaveNoViolations } from 'jest-axe'; // For accessibility testing

// Extend Jest with jest-axe matchers
expect.extend(toHaveNoViolations);

import RepairJourneyShare from '@/components/body-shop/RepairJourneyShare';
import logger from '@/utils/logger';
import { toast } from '@/utils/toast'; // Mock toast notifications

// Mock external dependencies
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

describe('RepairJourneyShare', () => {
    const mockJobId = 'job-xyz-123';
    const mockVehicleMake = 'Toyota';
    const mockVehicleModel = 'Camry';
    const expectedShareLink = `https://cfh.com/journey/${mockJobId}`;

    // Mock clipboard API (document.execCommand('copy'))
    let clipboardWriteTextSpy: jest.SpyInstance;
    let tempInput: HTMLInputElement | null = null;

    beforeEach(() => {
        cleanup(); // Clean up DOM after each test
        jest.clearAllMocks(); // Clear all mock calls

        // Mock setTimeout to run immediately for performance checks
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => cb());
        jest.spyOn(global, 'clearTimeout').mockImplementation(() => {});

        // Mock document.execCommand for clipboard
        clipboardWriteTextSpy = jest.spyOn(document, 'execCommand').mockImplementation((command: string) => {
            if (command === 'copy') {
                // Simulate copying the value from the temporary input
                return true;
            }
            return false;
        });

        // Mock window.location.href for mailto link
        Object.defineProperty(window, 'location', {
            writable: true,
            value: { href: jest.fn() },
        });
    });

    afterEach(() => {
        (global.setTimeout as jest.Mock).mockRestore();
        (global.clearTimeout as jest.Mock).mockRestore();
        clipboardWriteTextSpy.mockRestore();
        if (tempInput && document.body.contains(tempInput)) {
            document.body.removeChild(tempInput);
        }
    });

    // --- Link Generation Tests ---
    it('should generate and display the share link', async () => {
        render(<RepairJourneyShare jobId={mockJobId} vehicleMake={mockVehicleMake} vehicleModel={mockVehicleModel} />);
        
        expect(screen.getByText('Generating share link...')).toBeInTheDocument(); // Initial loading state
        await waitFor(() => {
            expect(screen.queryByText('Generating share link...')).not.toBeInTheDocument();
            const linkInput = screen.getByLabelText(`Shareable link for job ${mockJobId}`) as HTMLInputElement;
            expect(linkInput).toBeInTheDocument();
            expect(linkInput.value).toBe(expectedShareLink);
        });
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`RepairJourneyShare: Generated share link for job ${mockJobId}`));
    });

    // --- Copy to Clipboard Functionality ---
    it('should copy the link to clipboard and show success toast', async () => {
        render(<RepairJourneyShare jobId={mockJobId} vehicleMake={mockVehicleMake} vehicleModel={mockVehicleModel} />);
        await waitFor(() => expect(screen.getByLabelText(`Shareable link for job ${mockJobId}`)).toBeInTheDocument());

        const copyButton = screen.getByRole('button', { name: /Copy Link/i });
        await userEvent.click(copyButton);

        expect(clipboardWriteTextSpy).toHaveBeenCalledWith('copy');
        expect(toast.success).toHaveBeenCalledWith('Repair journey link copied to clipboard!', expect.any(Object));
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`RepairJourneyShare: Link copied to clipboard for job ${mockJobId}`));
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`AUDIT: User copied share link for job ${mockJobId}`));
    });

    it('should show error toast if copy to clipboard fails', async () => {
        clipboardWriteTextSpy.mockImplementationOnce(() => {
            throw new Error('Copy command failed');
        });

        render(<RepairJourneyShare jobId={mockJobId} vehicleMake={mockVehicleMake} vehicleModel={mockVehicleModel} />);
        await waitFor(() => expect(screen.getByLabelText(`Shareable link for job ${mockJobId}`)).toBeInTheDocument());

        const copyButton = screen.getByRole('button', { name: /Copy Link/i });
        await userEvent.click(copyButton);

        expect(toast.error).toHaveBeenCalledWith('Failed to copy link. Please try manually.', expect.any(Object));
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`RepairJourneyShare: Failed to copy link for job ${mockJobId}`), expect.any(Error));
    });

    // --- Email Sharing Functionality ---
    it('should open email client with pre-filled mailto link', async () => {
        render(<RepairJourneyShare jobId={mockJobId} vehicleMake={mockVehicleMake} vehicleModel={mockVehicleModel} />);
        await waitFor(() => expect(screen.getByLabelText(`Shareable link for job ${mockJobId}`)).toBeInTheDocument());

        const emailButton = screen.getByRole('button', { name: /Share via Email/i });
        await userEvent.click(emailButton);

        const expectedSubject = encodeURIComponent(`Check out the repair journey for my ${mockVehicleMake} ${mockVehicleModel}!`);
        const expectedBody = encodeURIComponent(`Hi,\n\nI wanted to share the repair journey of my ${mockVehicleMake} ${mockVehicleModel} on Rivers Auction Platform. You can track its progress here:\n\n${expectedShareLink}\n\nBest,\n[Your Name]`);
        const expectedMailtoLink = `mailto:?subject=${expectedSubject}&body=${expectedBody}`;

        expect(window.location.href).toBe(expectedMailtoLink);
        expect(toast.info).toHaveBeenCalledWith('Opening email client...', expect.any(Object));
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`RepairJourneyShare: Email share initiated for job ${mockJobId}`));
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`AUDIT: User initiated email share for job ${mockJobId}`));
    });

    // --- Tiered Social Sharing Buttons (Premium) ---
    it('should not render social sharing buttons for Free tier', async () => {
        render(<RepairJourneyShare jobId={mockJobId} vehicleMake={mockVehicleMake} vehicleModel={mockVehicleModel} userTier="free" />);
        await waitFor(() => expect(screen.getByLabelText(`Shareable link for job ${mockJobId}`)).toBeInTheDocument());

        expect(screen.queryByRole('button', { name: /Share on Twitter/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Share on Facebook/i })).not.toBeInTheDocument();
    });

    it('should render social sharing buttons for Premium tier', async () => {
        render(<RepairJourneyShare jobId={mockJobId} vehicleMake={mockVehicleMake} vehicleModel={mockVehicleModel} userTier="premium" />);
        await waitFor(() => expect(screen.getByLabelText(`Shareable link for job ${mockJobId}`)).toBeInTheDocument());

        expect(screen.getByRole('button', { name: /Share on Twitter/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Share on Facebook/i })).toBeInTheDocument();
        // Cod1+ TODO: Test click events for these social share buttons (e.g., opening new window with correct share URL)
    });

    // --- Accessibility Tests (Jest-Axe) ---
    it('should have no accessibility violations for Free tier', async () => {
        const { container } = render(<RepairJourneyShare jobId={mockJobId} vehicleMake={mockVehicleMake} vehicleModel={mockVehicleModel} userTier="free" />);
        await waitFor(() => expect(screen.getByLabelText(`Shareable link for job ${mockJobId}`)).toBeInTheDocument());
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations for Premium tier', async () => {
        const { container } = render(<RepairJourneyShare jobId={mockJobId} vehicleMake={mockVehicleMake} vehicleModel={mockVehicleModel} userTier="premium" />);
        await waitFor(() => expect(screen.getByLabelText(`Shareable link for job ${mockJobId}`)).toBeInTheDocument());
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    // --- Performance Test ---
    it('should log a warning if copy link action time exceeds 500ms', async () => {
        // Mock setTimeout to simulate a long operation within handleCopyLink
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any, ms: number) => {
            // Simulate a delay that causes the action to exceed 500ms
            if (ms === 0) { // For immediate execution or minor delays
                setTimeout(() => cb(), 501); // Force a delay > 500ms
            } else {
                setTimeout(cb, ms);
            }
            return {} as any;
        });

        render(<RepairJourneyShare jobId={mockJobId} vehicleMake={mockVehicleMake} vehicleModel={mockVehicleModel} />);
        await waitFor(() => expect(screen.getByLabelText(`Shareable link for job ${mockJobId}`)).toBeInTheDocument());

        const copyButton = screen.getByRole('button', { name: /Copy Link/i });
        await userEvent.click(copyButton);

        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('RepairJourneyShare: Copy link action exceeded 500ms'));
    });

    it('should log a warning if email share action time exceeds 500ms', async () => {
        // Mock setTimeout to simulate a long operation within handleEmailShare
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any, ms: number) => {
            if (ms === 0) { // For immediate execution or minor delays
                setTimeout(() => cb(), 501); // Force a delay > 500ms
            } else {
                setTimeout(cb, ms);
            }
            return {} as any;
        });

        render(<RepairJourneyShare jobId={mockJobId} vehicleMake={mockVehicleMake} vehicleModel={mockVehicleModel} />);
        await waitFor(() => expect(screen.getByLabelText(`Shareable link for job ${mockJobId}`)).toBeInTheDocument());

        const emailButton = screen.getByRole('button', { name: /Share via Email/i });
        await userEvent.click(emailButton);

        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('RepairJourneyShare: Email share action exceeded 500ms'));
    });
});
/*
File: PartsOrderForm.test.tsx
Path: C:\CFH\frontend\tests\components\body-shop\PartsOrderForm.test.tsx
Created: 2025-07-05 11:15 AM PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest test file for PartsOrderForm with RTL and accessibility checks.
Artifact ID: k0l1m2n3-o4p5-q6r7-s8t9-u0v1w2x3y4z5
Version ID: l1m2n3o4-p5q6-r7s8-t9u0-v1w2x3y4z5a6
*/

import React from 'react';
import { render, screen, waitFor, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'; // For extended matchers like toBeInTheDocument
import { axe, toHaveNoViolations } from 'jest-axe'; // For accessibility testing
import { z } from 'zod'; // Import Zod for schema access if needed for specific mocks

// Extend Jest with jest-axe matchers
expect.extend(toHaveNoViolations);

import PartsOrderForm from '@/components/body-shop/PartsOrderForm';
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

// Mock the partsOrderingApi service
const mockPlaceOrder = jest.fn();
jest.mock('@/services/partsOrderingApi', () => ({
    partsOrderingApi: {
        placeOrder: mockPlaceOrder,
    },
}));


describe('PartsOrderForm', () => {
    const mockJobId = '123e4567-e89b-12d3-a456-426614174000';
    const mockShopId = '987fcdef-1234-abcd-5678-9012efghijkl';

    beforeEach(() => {
        cleanup(); // Clean up DOM after each test
        jest.clearAllMocks(); // Clear all mock calls
        // Default mock implementation for placeOrder to succeed
        mockPlaceOrder.mockResolvedValue({ status: 'success', orderId: 'mock-order-id' });
        // Mock setTimeout to run immediately for performance checks
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => cb());
        jest.spyOn(global, 'clearTimeout').mockImplementation(() => {});
    });

    afterEach(() => {
        (global.setTimeout as jest.Mock).mockRestore();
        (global.clearTimeout as jest.Mock).mockRestore();
    });

    // --- Form Validation Tests ---
    it('should display validation errors for empty part name on submit', async () => {
        render(<PartsOrderForm jobId={mockJobId} shopId={mockShopId} />);
        const partNameInput = screen.getByLabelText('Part name for item 1');
        await userEvent.clear(partNameInput); // Clear default value

        const submitButton = screen.getByRole('button', { name: /Place Order/i });
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Part name: Part name must be at least 2 characters')).toBeInTheDocument();
        });
        expect(mockPlaceOrder).not.toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Validation Error: Part name must be at least 2 characters'), expect.any(Object));
    });

    it('should display validation errors for non-positive quantity on submit', async () => {
        render(<PartsOrderForm jobId={mockJobId} shopId={mockShopId} />);
        const quantityInput = screen.getByLabelText('Quantity for item 1');
        await userEvent.clear(quantityInput);
        await userEvent.type(quantityInput, '0');

        const submitButton = screen.getByRole('button', { name: /Place Order/i });
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Quantity: Quantity must be a positive whole number')).toBeInTheDocument();
        });
        expect(mockPlaceOrder).not.toHaveBeenCalled();
    });

    it('should display validation errors for empty parts list on submit', async () => {
        render(<PartsOrderForm jobId={mockJobId} shopId={mockShopId} />);
        const removeButton = screen.getByRole('button', { name: /Remove part item 1/i });
        await userEvent.click(removeButton); // Remove the only part

        const submitButton = screen.getByRole('button', { name: /Place Order/i });
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('parts: At least one part is required for the order.')).toBeInTheDocument();
        });
        expect(mockPlaceOrder).not.toHaveBeenCalled();
    });

    // --- Dynamic Part Rows ---
    it('should add a new part row when "Add Another Part" is clicked', async () => {
        render(<PartsOrderForm jobId={mockJobId} shopId={mockShopId} />);
        const addPartButton = screen.getByRole('button', { name: /Add Another Part/i });
        await userEvent.click(addPartButton);

        expect(screen.getByLabelText('Part name for item 2')).toBeInTheDocument();
        expect(screen.getByLabelText('Quantity for item 2')).toBeInTheDocument();
    });

    it('should remove a part row when "Remove Part" is clicked', async () => {
        render(<PartsOrderForm jobId={mockJobId} shopId={mockShopId} />);
        const addPartButton = screen.getByRole('button', { name: /Add Another Part/i });
        await userEvent.click(addPartButton); // Add a second part

        const removeButton = screen.getAllByRole('button', { name: /Remove Part/i })[0]; // Get the first remove button
        await userEvent.click(removeButton);

        expect(screen.queryByLabelText('Part name for item 1')).not.toBeInTheDocument();
        expect(screen.getByLabelText('Part name for item 2')).toBeInTheDocument(); // The second part should now be the first
    });

    // --- Submission Success/Failure Tests ---
    it('should submit the form successfully with valid data', async () => {
        render(<PartsOrderForm jobId={mockJobId} shopId={mockShopId} />);
        
        const partNameInput = screen.getByLabelText('Part name for item 1');
        await userEvent.type(partNameInput, 'Bumper');
        const quantityInput = screen.getByLabelText('Quantity for item 1');
        await userEvent.clear(quantityInput);
        await userEvent.type(quantityInput, '1');

        const submitButton = screen.getByRole('button', { name: /Place Order/i });
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(mockPlaceOrder).toHaveBeenCalledTimes(1);
            expect(mockPlaceOrder).toHaveBeenCalledWith({
                jobId: mockJobId,
                shopId: mockShopId,
                parts: [{ partName: 'Bumper', quantity: 1 }],
            });
            expect(toast.success).toHaveBeenCalledWith('Parts order placed successfully!', expect.any(Object));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`PartsOrderForm: Order submitted successfully for Job ID: ${mockJobId}`));
            expect(screen.queryByText('Placing Order...')).not.toBeInTheDocument();
        });
    });

    it('should display error toast and log on API submission failure', async () => {
        mockPlaceOrder.mockRejectedValueOnce(new Error('API error')); // Simulate API failure

        render(<PartsOrderForm jobId={mockJobId} shopId={mockShopId} />);
        
        const partNameInput = screen.getByLabelText('Part name for item 1');
        await userEvent.type(partNameInput, 'Bumper');
        const quantityInput = screen.getByLabelText('Quantity for item 1');
        await userEvent.clear(quantityInput);
        await userEvent.type(quantityInput, '1');

        const submitButton = screen.getByRole('button', { name: /Place Order/i });
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(mockPlaceOrder).toHaveBeenCalledTimes(1);
            expect(toast.error).toHaveBeenCalledWith('Failed to place parts order. Please try again.', expect.any(Object));
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('PartsOrderForm: API submission failed:'), expect.any(Error));
            expect(screen.queryByText('Placing Order...')).not.toBeInTheDocument();
        });
    });

    // --- Accessibility Tests (Jest-Axe) ---
    it('should have no accessibility violations', async () => {
        const { container } = render(<PartsOrderForm jobId={mockJobId} shopId={mockShopId} />);
        await waitFor(() => expect(screen.getByLabelText('Part name for item 1')).toBeInTheDocument());
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    // --- Performance Check ---
    it('should log a warning if submission time exceeds 500ms', async () => {
        // Mock setTimeout to simulate a long submission
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any, ms: number) => {
            if (ms === 300) { // This is the mock API call delay
                setTimeout(() => cb(), 501); // Make it exceed 500ms
            } else {
                setTimeout(cb, ms);
            }
            return {} as any;
        });

        render(<PartsOrderForm jobId={mockJobId} shopId={mockShopId} />);
        const partNameInput = screen.getByLabelText('Part name for item 1');
        await userEvent.type(partNameInput, 'Slow Part');
        const quantityInput = screen.getByLabelText('Quantity for item 1');
        await userEvent.clear(quantityInput);
        await userEvent.type(quantityInput, '1');

        const submitButton = screen.getByRole('button', { name: /Place Order/i });
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('PartsOrderForm submission time exceeded 500ms'));
        });
    });
});
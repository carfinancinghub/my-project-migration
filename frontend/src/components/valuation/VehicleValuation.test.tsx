/*
 * File: VehicleValuation.test.tsx
 * Path: C:\CFH\frontend\src\components\valuation\VehicleValuation.test.tsx
 * Created: 2025-06-30 19:45 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Jest tests for VehicleValuation component.
 * Artifact ID: test-vehicle-valuation-ui
 * Version ID: test-vehicle-valuation-ui-v1.0.0
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VehicleValuation } from './VehicleValuation';

// Mock child components
jest.mock('./ValuationReport', () => ({
  ValuationReport: () => <div>Valuation Report</div>
}));
jest.mock('./ARConditionScanner', () => ({
  ARConditionScanner: () => <div>AR Scanner</div>
}));

// Mock the fetch API
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ tradeIn: 25000, privateParty: 28000 }),
    })
) as jest.Mock;

describe('VehicleValuation', () => {
    // Mock the fetch API
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ tradeIn: 25000, privateParty: 28000 }),
        })
    ) as jest.Mock;

    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
    });

    it('displays an error for an invalid VIN', async () => {
        render(<VehicleValuation userTier="Free" onBook={() => {}} />);
        const vinInput = screen.getByPlaceholderText('Enter VIN');
        const submitButton = screen.getByText('Get Valuation');

        fireEvent.change(vinInput, { target: { value: 'SHORTVIN' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Invalid VIN. Please enter a 17-character VIN.')).toBeInTheDocument();
        });
    });

    it('renders premium features for a premium user', () => {
        render(<VehicleValuation userTier="Premium" onBook={() => {}} />);
        expect(screen.getByText('Good')).toBeInTheDocument(); // Condition dropdown
    });

    it('does not render premium features for a free user', () => {
        render(<VehicleValuation userTier="Free" onBook={() => {}} />);
        expect(screen.queryByText('Good')).not.toBeInTheDocument();
    });

    it('calls the API on valid VIN submission', async () => {
        render(<VehicleValuation userTier="Standard" onBook={() => {}} />);
        const vinInput = screen.getByPlaceholderText('Enter VIN');
        const submitButton = screen.getByText('Get Valuation');

        fireEvent.change(vinInput, { target: { value: '12345678901234567' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
            expect(screen.getByText('Valuation Report')).toBeInTheDocument();
        });
    });
});
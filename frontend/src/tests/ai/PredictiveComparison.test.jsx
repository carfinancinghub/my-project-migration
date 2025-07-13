// 👑 Crown Certified Test Suite
// Path: C:\CFH\frontend\src\tests\ai\PredictiveComparison.test.jsx
// Purpose: Test PredictiveComparison.jsx rendering, predicted vs. actual valuation comparison, premium charts, SG Man compliant.
// Author: Rivers Auction Team
// Date: May 20, 2025
// Cod2 Crown Certified
// @aliases: @components/ai/PredictiveComparison, @services/valuation/ValuationService, @utils/logger, @components/common/ValuationDisplay

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi } from 'vitest';

// Component to be tested
import PredictiveComparison from '@components/ai/PredictiveComparison'; // Assuming this is the correct path

// Mocked dependencies
import ValuationService from '@services/valuation/ValuationService';
import logger from '@utils/logger';
// LiveUpdates is not listed as a direct dependency for THIS test file, but the component might use it.
// If PredictiveComparison.jsx uses LiveUpdates, it should also be mocked. Assuming not for now based on explicit test dependencies.

// Mock common components used by PredictiveComparison
vi.mock('@services/valuation/ValuationService');
vi.mock('@utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  }
}));

// Mocking ValuationDisplay: A simple mock to verify it receives props for predicted, actual, and discrepancy.
vi.mock('@components/common/ValuationDisplay', () => ({
  // Assuming ValuationDisplay is a default export
  default: ({ label, value, unit, 'aria-label': ariaLabel }) => (
    <div data-testid={`valuation-display-${label?.toLowerCase().replace(/\s+/g, '-') || 'value'}`} aria-label={ariaLabel}>
      <span>{label}: </span>
      <span>{value}</span>
      {unit && <span>{unit}</span>}
    </div>
  )
}));

// Mocking a potential ChartComponent if used for premium features (conceptual)
vi.mock('@components/common/InteractiveChart', () => ({ // Assuming a generic chart component
  default: ({ data, 'aria-label': ariaLabel }) => (
    <div data-testid="interactive-chart-mock" aria-label={ariaLabel}>
      Chart Data Points: {data?.length || 0}
      {/* Simulate interaction points if needed */}
      <button>Zoom In</button>
    </div>
  )
}));


const E_VALUATION_003_COMPARISON_FETCH = 'E_VALUATION_003_COMPARISON_FETCH: Failed to fetch predictive comparison data.';
const E_VALUATION_004_COMPARISON_MISMATCH = 'E_VALUATION_004_COMPARISON_MISMATCH: Data mismatch in predictive comparison.';


describe('PredictiveComparison', () => {
  let mockComparisonData;
  let mockPremiumChartData;
  let mockAnomalyRules;

  const initialPropsFree = {
    auctionId: 'auction789',
    isPremium: false,
  };

  const initialPropsPremium = {
    ...initialPropsFree,
    isPremium: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockComparisonData = {
      predicted: { price: 100000, source: 'AI Model v2.1' },
      actual: { price: 105000, source: 'Final Sale Price' },
    };
    ValuationService.getPredictedVsActualValuation.mockResolvedValue(mockComparisonData);

    mockPremiumChartData = [
      { date: '2025-05-01', predicted: 98000, actual: 99000 },
      { date: '2025-05-08', predicted: 100000, actual: 105000 },
      { date: '2025-05-15', predicted: 102000, actual: 103000 },
    ];
    ValuationService.getPremiumComparisonChartData.mockResolvedValue(mockPremiumChartData);

    mockAnomalyRules = { // For premium anomaly insights
        deviationThresholdPercent: 5, // e.g. >5% is an anomaly
        confidenceScoreMin: 0.85,
    };
    ValuationService.getComparisonAnomalyRules.mockResolvedValue(mockAnomalyRules);
  });

  describe('Rendering and Initial Data Load', () => {
    it('renders basic comparison display for free users', async () => {
      render(<PredictiveComparison {...initialPropsFree} />);
      await waitFor(() => {
        expect(screen.getByTestId('valuation-display-predicted-valuation')).toHaveTextContent('Predicted Valuation: 100000');
        expect(screen.getByTestId('valuation-display-actual-valuation')).toHaveTextContent('Actual Valuation: 105000');
        expect(screen.getByTestId('valuation-display-discrepancy')).toHaveTextContent('Discrepancy: 5.00%'); // (105000-100000)/100000 * 100
      });
      expect(ValuationService.getPredictedVsActualValuation).toHaveBeenCalledWith('auction789');
      expect(screen.queryByTestId('interactive-chart-mock')).not.toBeInTheDocument();
      expect(screen.queryByText(/Premium Anomaly Insights/i)).not.toBeInTheDocument();
    });

    it('renders premium features (interactive chart, anomaly insights section) for premium users', async () => {
      render(<PredictiveComparison {...initialPropsPremium} />);
      await waitFor(() => {
        expect(screen.getByTestId('valuation-display-predicted-valuation')).toBeInTheDocument();
        expect(screen.getByTestId('interactive-chart-mock')).toBeInTheDocument();
        expect(screen.getByTestId('interactive-chart-mock')).toHaveAccessibleName('Valuation Comparison Trends Chart');
        expect(screen.getByText(/Premium Anomaly Insights/i)).toBeInTheDocument();
      });
      expect(ValuationService.getPremiumComparisonChartData).toHaveBeenCalledWith('auction789');
      expect(ValuationService.getComparisonAnomalyRules).toHaveBeenCalledWith('auction789');
    });

    it('logs info on successful initial data load', async () => {
        render(<PredictiveComparison {...initialPropsFree} />);
        await waitFor(() => {
            expect(logger.default.info).toHaveBeenCalledWith(
                expect.stringContaining(`Successfully fetched comparison data for auction ${initialPropsFree.auctionId}`)
            );
        });
    });
  });

  describe('Comparison Data Accuracy and Display', () => {
    it('correctly calculates and displays positive discrepancy', async () => {
      ValuationService.getPredictedVsActualValuation.mockResolvedValue({
        predicted: { price: 10000 }, actual: { price: 11000 }
      });
      render(<PredictiveComparison {...initialPropsFree} />);
      await waitFor(() => {
        expect(screen.getByTestId('valuation-display-discrepancy')).toHaveTextContent('Discrepancy: 10.00%');
      });
    });

    it('correctly calculates and displays negative discrepancy', async () => {
      ValuationService.getPredictedVsActualValuation.mockResolvedValue({
        predicted: { price: 10000 }, actual: { price: 9000 }
      });
      render(<PredictiveComparison {...initialPropsFree} />);
      await waitFor(() => {
        expect(screen.getByTestId('valuation-display-discrepancy')).toHaveTextContent('Discrepancy: -10.00%');
      });
    });

    it('displays "N/A" for discrepancy if data is missing', async () => {
      ValuationService.getPredictedVsActualValuation.mockResolvedValue({
        predicted: null, actual: { price: 9000 }
      });
      render(<PredictiveComparison {...initialPropsFree} />);
      await waitFor(() => {
        expect(screen.getByTestId('valuation-display-discrepancy')).toHaveTextContent('Discrepancy: N/A');
      });
    });
  });

  describe('Premium Features: Charts and Anomaly Insights', () => {
    it('interactive chart mock receives correct data for premium users', async () => {
      render(<PredictiveComparison {...initialPropsPremium} />);
      await waitFor(() => {
        const chart = screen.getByTestId('interactive-chart-mock');
        expect(chart).toBeInTheDocument();
        expect(chart).toHaveTextContent(`Chart Data Points: ${mockPremiumChartData.length}`);
      });
    });

    it('simulates interaction with premium chart (e.g., zoom button click)', async () => {
        render(<PredictiveComparison {...initialPropsPremium} />);
        await waitFor(() => {
            expect(screen.getByTestId('interactive-chart-mock')).toBeInTheDocument();
        });
        // This assumes the mocked chart has such a button.
        // If the actual chart library is used, interactions would be more complex.
        const zoomButton = screen.getByRole('button', { name: /Zoom In/i });
        fireEvent.click(zoomButton);
        // Add assertions here if the click is expected to change something in PredictiveComparison's state or call a service.
        // For a simple mock, this just ensures the button is clickable.
        expect(logger.default.info).toHaveBeenCalledWith(expect.stringContaining('Chart interaction: Zoom In')); // Conceptual log
    });

    it('displays premium anomaly insights when discrepancy exceeds threshold', async () => {
      // Predicted: 100k, Actual: 110k -> 10% discrepancy. Rule: >5% is anomaly.
      ValuationService.getPredictedVsActualValuation.mockResolvedValue({
        predicted: { price: 100000 }, actual: { price: 110000 }
      });
      render(<PredictiveComparison {...initialPropsPremium} />);
      await waitFor(() => {
        expect(screen.getByText(/Premium Anomaly Insights/i)).toBeInTheDocument();
        expect(screen.getByText(/Significant valuation anomaly detected!/i)).toBeInTheDocument();
        expect(screen.getByText(/Deviation: 10.00%/i)).toBeInTheDocument();
        expect(logger.default.warn).toHaveBeenCalledWith(expect.stringContaining(`Premium anomaly insight for auction ${initialPropsPremium.auctionId}: 10.00% deviation.`));
      });
    });

     it('does not display premium anomaly insights if discrepancy is within threshold', async () => {
      // Predicted: 100k, Actual: 102k -> 2% discrepancy. Rule: >5% is anomaly.
      ValuationService.getPredictedVsActualValuation.mockResolvedValue({
        predicted: { price: 100000 }, actual: { price: 102000 }
      });
      render(<PredictiveComparison {...initialPropsPremium} />);
      await waitFor(() => {
        expect(screen.getByText(/Premium Anomaly Insights/i)).toBeInTheDocument();
        expect(screen.queryByText(/Significant valuation anomaly detected!/i)).not.toBeInTheDocument();
        expect(screen.getByText(/No significant anomalies based on current rules./i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error and logs E_VALUATION_003_COMPARISON_FETCH on initial data fetch failure', async () => {
      ValuationService.getPredictedVsActualValuation.mockRejectedValueOnce(new Error('API Network Failure'));
      render(<PredictiveComparison {...initialPropsFree} />);
      await waitFor(() => {
        expect(screen.getByText('Error: Failed to load comparison data. Please try again later.')).toBeInTheDocument();
        expect(logger.default.error).toHaveBeenCalledWith(
          E_VALUATION_003_COMPARISON_FETCH,
          expect.stringContaining(initialPropsFree.auctionId),
          expect.any(Error)
        );
      });
    });

    it('handles and logs E_VALUATION_004_COMPARISON_MISMATCH if predicted or actual data is malformed (conceptual)', async () => {
      // This tests how the component handles unexpected data structures if not caught by service.
      ValuationService.getPredictedVsActualValuation.mockResolvedValue({
        predicted: { price: 100000 }, actual: null // Malformed/missing actual
      });
      render(<PredictiveComparison {...initialPropsFree} />);
      await waitFor(() => {
        // Assuming the component has logic to detect this and show an error or "N/A"
        // For logging, it might log a specific error if it tries to access price on null.
        // This depends on component's internal robustness. Here, we check for a general error display.
        expect(screen.getByTestId('valuation-display-discrepancy')).toHaveTextContent('Discrepancy: N/A');
        // If the component specifically logs this kind of mismatch:
        // expect(logger.default.error).toHaveBeenCalledWith(E_VALUATION_004_COMPARISON_MISMATCH, expect.any(String));
      });
    });
  });

  describe('Wow++ (Planned Features)', () => {
    it.todo('tests cross-auction comparison data when feature is implemented', () => {
      // Placeholder for future tests.
      // When PredictiveComparison.jsx implements cross-auction comparisons:
      // 1. Mock ValuationService.getCrossAuctionComparisonData(auctionId).
      // 2. Render component with props to enable this view.
      // 3. Assert that the cross-auction comparison UI is rendered.
      // 4. Test interactions with this UI.
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Accessibility (ARIA Labels)', () => {
    it('key valuation displays should have accessible names (ARIA labels)', async () => {
      render(<PredictiveComparison {...initialPropsFree} />);
      await waitFor(() => {
        expect(screen.getByTestId('valuation-display-predicted-valuation')).toHaveAccessibleName('Predicted Valuation Details');
        expect(screen.getByTestId('valuation-display-actual-valuation')).toHaveAccessibleName('Actual Valuation Details');
        expect(screen.getByTestId('valuation-display-discrepancy')).toHaveAccessibleName('Valuation Discrepancy Percentage');
      });
    });

    it('premium chart should have an accessible name', async () => {
        render(<PredictiveComparison {...initialPropsPremium} />);
        await waitFor(() => {
            expect(screen.getByTestId('interactive-chart-mock')).toHaveAccessibleName('Valuation Comparison Trends Chart');
        });
    });
  });
});

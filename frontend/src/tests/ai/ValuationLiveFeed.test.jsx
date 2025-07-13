// 👑 Crown Certified Test Suite
// Path: C:\CFH\frontend\src\tests\ai\ValuationLiveFeed.test.jsx
// Purpose: Test ValuationLiveFeed.jsx rendering, WebSocket updates, premium heatmap, anomaly detection, SG Man compliant.
// Author: Rivers Auction Team
// Date: May 20, 2025
// Cod2 Crown Certified
// @aliases: @components/ai/ValuationLiveFeed, @services/valuation/ValuationService, @services/websocket/LiveUpdates, @utils/logger, @components/common/ValuationDisplay, @components/common/HeatmapCanvas

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi } from 'vitest';

// Component to be tested
import ValuationLiveFeed from '@components/ai/ValuationLiveFeed';

// Mocked dependencies
import ValuationService from '@services/valuation/ValuationService';
import LiveUpdates from '@services/websocket/LiveUpdates';
import logger from '@utils/logger';

// Mock common components used by ValuationLiveFeed
// These mocks allow us to isolate testing to ValuationLiveFeed itself.
vi.mock('@services/valuation/ValuationService');
vi.mock('@services/websocket/LiveUpdates');
vi.mock('@utils/logger', () => ({
  default: { // Assuming logger is a default export
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  }
}));

// Mocking ValuationDisplay: A simple mock to verify it receives props.
vi.mock('@components/common/ValuationDisplay', () => ({
  default: ({ valuations, currentValuation, error }) => (
    <div data-testid="valuation-display">
      <span data-testid="current-valuation-mock">{currentValuation?.price || 'N/A'}</span>
      {valuations && <span data-testid="valuation-count-mock">{`Count: ${valuations.length}`}</span>}
      {error && <span data-testid="valuation-error-mock">{error}</span>}
    </div>
  )
}));

// Mocking HeatmapCanvas: A simple mock to verify it's rendered and receives data.
vi.mock('@components/common/HeatmapCanvas', () => ({
  default: ({ data, 'aria-label': ariaLabel }) => ( // Capture aria-label
    <canvas data-testid="heatmap-canvas-mock" aria-label={ariaLabel}>
      {`Heatmap Data Points: ${data?.length || 0}`}
    </canvas>
  )
}));

const E_VALUATION_001_FETCH = 'E_VALUATION_001_FETCH: Failed to fetch initial valuation history.';
const E_VALUATION_002_WS = 'E_VALUATION_002_WS: WebSocket connection error for live valuation.';

describe('ValuationLiveFeed', () => {
  let mockSocket;
  let mockValuationHistory;

  const initialPropsFree = {
    auctionId: 'auction123',
    userRole: 'buyer',
    isPremium: false,
  };

  const initialPropsPremium = {
    ...initialPropsFree,
    isPremium: true,
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup mock WebSocket
    mockSocket = {
      on: vi.fn(),
      disconnect: vi.fn(),
      connect: vi.fn(), // Added connect if LiveUpdates.connect() is called inside component
    };
    LiveUpdates.connect.mockReturnValue(mockSocket); // Mock the connect method to return our mockSocket

    // Setup mock ValuationService
    mockValuationHistory = [
      { id: 'v1', price: 50000, timestamp: Date.now() - 100000, type: 'historical' },
      { id: 'v2', price: 51000, timestamp: Date.now() - 50000, type: 'historical' },
    ];
    ValuationService.getValuationHistory.mockResolvedValue({ data: mockValuationHistory, current: mockValuationHistory[1] });
    ValuationService.getAnomalyDetectionRules.mockResolvedValue({ // For premium advanced anomaly insights
        thresholdPercentage: 15, // e.g. 15% deviation is an anomaly
        minSampleSize: 5,
    });
  });

  // Test Suite Structure
  describe('Rendering and Initial Load', () => {
    it('renders basic valuation display for free users', async () => {
      render(<ValuationLiveFeed {...initialPropsFree} />);
      await waitFor(() => {
        expect(screen.getByTestId('valuation-display')).toBeInTheDocument();
        expect(screen.getByTestId('current-valuation-mock')).toHaveTextContent('51000'); // From mockValuationHistory
      });
      expect(ValuationService.getValuationHistory).toHaveBeenCalledWith('auction123');
      expect(screen.queryByTestId('heatmap-canvas-mock')).not.toBeInTheDocument();
      expect(screen.queryByText(/Advanced Anomaly Insights/i)).not.toBeInTheDocument();
    });

    it('renders premium features (heatmap toggle, advanced anomaly section) for premium users', async () => {
      render(<ValuationLiveFeed {...initialPropsPremium} />);
      await waitFor(() => {
        expect(screen.getByTestId('valuation-display')).toBeInTheDocument();
        expect(screen.getByTestId('heatmap-canvas-mock')).toBeInTheDocument(); // HeatmapCanvas mock
        expect(screen.getByTestId('heatmap-canvas-mock')).toHaveAccessibleName('Valuation Trends Heatmap');
        expect(screen.getByText(/Advanced Anomaly Insights/i)).toBeInTheDocument(); // Placeholder for advanced insights
      });
      expect(ValuationService.getAnomalyDetectionRules).toHaveBeenCalledWith('auction123');
    });

    it('logs info on successful initial data load', async () => {
        render(<ValuationLiveFeed {...initialPropsFree} />);
        await waitFor(() => {
            expect(logger.default.info).toHaveBeenCalledWith(
                expect.stringContaining(`Successfully fetched initial valuation history for auction ${initialPropsFree.auctionId}`)
            );
        });
    });
  });

  describe('WebSocket Updates', () => {
    it('connects to WebSocket at /ws/valuation/live on mount', () => {
      render(<ValuationLiveFeed {...initialPropsFree} />);
      expect(LiveUpdates.connect).toHaveBeenCalledWith('/ws/valuation/live');
      expect(mockSocket.on).toHaveBeenCalledWith('valuationUpdate', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('updates current valuation and valuation history on "valuationUpdate" event', async () => {
      render(<ValuationLiveFeed {...initialPropsFree} />);
      await waitFor(() => { // Wait for initial load
        expect(screen.getByTestId('current-valuation-mock')).toHaveTextContent('51000');
      });

      const newLiveValuation = { price: 52500, timestamp: Date.now(), type: 'live' };
      // Simulate WebSocket event
      act(() => {
        const wsUpdateHandler = mockSocket.on.mock.calls.find(call => call[0] === 'valuationUpdate')[1];
        wsUpdateHandler({ auctionId: 'auction123', currentValuation: newLiveValuation, historicalPoint: newLiveValuation });
      });

      await waitFor(() => {
        expect(screen.getByTestId('current-valuation-mock')).toHaveTextContent('52500');
        // Assuming ValuationDisplay mock updates based on new valuations prop
        // Check if the new valuation is added to the history (implementation dependent in component)
      });
       expect(logger.default.info).toHaveBeenCalledWith(expect.stringContaining(`Live valuation update for ${initialPropsFree.auctionId}: 52500`));
    });

    it('disconnects from WebSocket on unmount', () => {
      const { unmount } = render(<ValuationLiveFeed {...initialPropsFree} />);
      unmount();
      expect(mockSocket.disconnect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Anomaly Detection', () => {
    it('displays basic anomaly alert for free users when a significant deviation occurs', async () => {
      render(<ValuationLiveFeed {...initialPropsFree} />);
      await waitFor(() => {}); // Initial load

      // Simulate a live update that triggers a basic anomaly (e.g., >20% deviation from last historical)
      const anomalyValuation = { price: 70000, timestamp: Date.now(), type: 'live' }; // >20% from 51000
      act(() => {
        const wsUpdateHandler = mockSocket.on.mock.calls.find(call => call[0] === 'valuationUpdate')[1];
        wsUpdateHandler({ auctionId: 'auction123', currentValuation: anomalyValuation, historicalPoint: anomalyValuation });
      });

      await waitFor(() => {
        // The component should identify this as an anomaly based on its internal logic
        // This test assumes the component's internal logic for anomaly detection for free tier is active
        // and it would render some text like "Anomaly Detected" or similar.
        // Since the component itself is not provided, we check for a generic anomaly message.
        expect(screen.getByText(/Anomaly Detected:/i)).toBeInTheDocument();
        expect(logger.default.warn).toHaveBeenCalledWith(expect.stringContaining(`Basic anomaly detected for auction ${initialPropsFree.auctionId}: 70000`));
      });
    });

    it('displays advanced anomaly insights for premium users', async () => {
      render(<ValuationLiveFeed {...initialPropsPremium} />);
      await waitFor(() => {}); // Initial load

      const anomalyValuation = { price: 80000, timestamp: Date.now(), type: 'live' };
      act(() => {
        const wsUpdateHandler = mockSocket.on.mock.calls.find(call => call[0] === 'valuationUpdate')[1];
        wsUpdateHandler({ auctionId: 'auction123', currentValuation: anomalyValuation, historicalPoint: anomalyValuation });
      });

      await waitFor(() => {
        expect(screen.getByText(/Advanced Anomaly Insights/i)).toBeInTheDocument();
        // Check for more specific details if the component renders them
        expect(screen.getByText(expect.stringContaining('Potential Advanced Anomaly: 80000'))).toBeInTheDocument();
         expect(logger.default.warn).toHaveBeenCalledWith(expect.stringContaining(`Premium anomaly detected for auction ${initialPropsPremium.auctionId}: 80000. Details: {deviationPercentage:`) );
      });
    });
  });

  describe('Premium Gating and Heatmap', () => {
    it('interactive heatmap is rendered and accessible for premium users', async () => {
      render(<ValuationLiveFeed {...initialPropsPremium} />);
      await waitFor(() => {
        const heatmapCanvas = screen.getByTestId('heatmap-canvas-mock');
        expect(heatmapCanvas).toBeInTheDocument();
        expect(heatmapCanvas).toHaveTextContent('Heatmap Data Points: 2'); // Based on mockValuationHistory
        expect(heatmapCanvas).toHaveAccessibleName('Valuation Trends Heatmap');
        // If heatmap were truly interactive, add fireEvent tests here
        // For example, if there were controls to change heatmap parameters:
        // fireEvent.click(screen.getByRole('button', {name: /Change Heatmap Metric/i}));
      });
    });

    it('heatmap is not rendered for free users', () => {
      render(<ValuationLiveFeed {...initialPropsFree} />);
      expect(screen.queryByTestId('heatmap-canvas-mock')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('displays error message and logs E_VALUATION_001_FETCH on initial data fetch failure', async () => {
      ValuationService.getValuationHistory.mockRejectedValueOnce(new Error('Network Error'));
      render(<ValuationLiveFeed {...initialPropsFree} />);
      await waitFor(() => {
        expect(screen.getByTestId('valuation-error-mock')).toHaveTextContent('Failed to load initial valuation data.');
        expect(logger.default.error).toHaveBeenCalledWith(
          E_VALUATION_001_FETCH,
          expect.stringContaining(initialPropsFree.auctionId),
          expect.any(Error)
        );
      });
    });

    it('displays error message and logs E_VALUATION_002_WS on WebSocket connection error', async () => {
      render(<ValuationLiveFeed {...initialPropsFree} />);
      await waitFor(() => {}); // Ensure component is mounted and socket.on is called

      // Simulate WebSocket error
      act(() => {
        const wsErrorHandler = mockSocket.on.mock.calls.find(call => call[0] === 'error')[1];
        wsErrorHandler(new Error('Connection refused'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('valuation-error-mock')).toHaveTextContent('Live updates currently unavailable.');
        expect(logger.default.error).toHaveBeenCalledWith(
          E_VALUATION_002_WS,
          expect.stringContaining(initialPropsFree.auctionId),
          expect.any(Error)
        );
      });
    });
  });

  describe('Wow++ (Planned Features)', () => {
    it.todo('tests cross-auction comparisons when feature is implemented', () => {
      // This test is a placeholder.
      // When ValuationLiveFeed.jsx implements cross-auction comparisons,
      // tests should be added here to verify:
      // 1. Fetching comparison data (e.g., from ValuationService.getCrossAuctionData).
      // 2. Rendering the comparison UI.
      // 3. Interactions with the comparison UI (if any).
      // Example:
      // ValuationService.getCrossAuctionData.mockResolvedValue({ auction123: {...}, auction456: {...} });
      // render(<ValuationLiveFeed {...initialPropsPremium} enableCrossAuctionView={true} />);
      // await waitFor(() => {
      //   expect(screen.getByText(/Comparison with Auction auction456/i)).toBeInTheDocument();
      // });
      expect(true).toBe(true); // Placeholder assertion
    });
  });

  describe('Accessibility (Basic Checks)', () => {
    it('heatmap canvas should have an accessible name for premium users', async () => {
        render(<ValuationLiveFeed {...initialPropsPremium} />);
        await waitFor(() => {
            const heatmap = screen.getByTestId('heatmap-canvas-mock');
            expect(heatmap).toHaveAccessibleName('Valuation Trends Heatmap');
        });
    });

    // Add more accessibility tests as the component structure becomes more defined
    // For example, if there are form elements for filtering heatmap data, they should have labels.
    // If there are critical status messages, they should have appropriate ARIA live regions.
  });
});


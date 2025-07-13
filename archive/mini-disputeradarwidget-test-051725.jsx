// Purpose: Validate rendering, WebSocket updates, premium alerts, filter functionality for DisputeRadarWidget.
// Author: Rivers Auction Team
// Date: May 17, 2025
// Cod2 Crown Certified

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import DisputeRadarWidget from '@components/officer/DisputeRadarWidget';
import DisputeService from '@services/dispute/DisputeService';
import LiveUpdates from '@services/websocket/LiveUpdates';
import logger from '@utils/logger';

// Mock dependencies
vi.mock('@services/dispute/DisputeService');
vi.mock('@services/websocket/LiveUpdates');
vi.mock('@utils/logger', () => ({
  default: { // Assuming logger is a default export
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  }
}));
vi.mock('@components/common/DisputeDisplay', () => ({
    // Ensure it's a default export if the component uses it that way
    default: ({ dispute }) => <div data-testid={`dispute-${dispute.id}`}>{dispute.description || `Dispute ${dispute.id}`}</div>
}));


const mockDisputesInitial = [
  { id: 'd1', description: 'Late shipment item', type: 'shipping', severity: 'medium', createdAt: Date.now() - 5*24*60*60*1000, officerId: 'officer123' },
  { id: 'd2', description: 'Item not as described fully', type: 'item_condition', severity: 'high', createdAt: Date.now() - 2*24*60*60*1000, officerId: 'officer123' },
  { id: 'd3', description: 'Payment processing issue', type: 'payment', severity: 'high', createdAt: Date.now() - 10*24*60*60*1000, officerId: 'officer123' },
];

const mockPremiumAlertsInitial = [
  { message: 'Potential hotspot: High severity item condition disputes', details: { type: 'item_condition', severity: 'high' } },
];

describe('DisputeRadarWidget', () => {
  let mockLiveUpdatesInstance;
  let newDisputeHandler = () => {};
  let disputeUpdateHandler = () => {};
  let wsErrorHandler = () => {};

  beforeEach(() => {
    // Reset mocks for each test to ensure isolation
    DisputeService.getDisputesForOfficer.mockResolvedValue([...mockDisputesInitial]); // Use a copy
    DisputeService.getPredictiveHotspots.mockResolvedValue([...mockPremiumAlertsInitial]); // Use a copy

    mockLiveUpdatesInstance = {
      connect: vi.fn(),
      disconnect: vi.fn(),
      on: vi.fn((event, handler) => { // Capture handlers for manual triggering
        if (event === 'new_dispute') newDisputeHandler = handler;
        if (event === 'dispute_update') disputeUpdateHandler = handler;
        if (event === 'error') wsErrorHandler = handler;
      }),
      emit: vi.fn(),
    };
    LiveUpdates.mockImplementation(() => mockLiveUpdatesInstance);
    vi.useFakeTimers(); // Use fake timers for controlling time-based events
  });

  afterEach(() => {
    vi.clearAllMocks(); // Clear all mocks
    vi.useRealTimers(); // Restore real timers
  });

  it('renders correctly for free users and fetches initial disputes', async () => {
    render(<DisputeRadarWidget officerId="officerTest1" isPremium={false} />);
    expect(screen.getByText('Dispute Radar')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(DisputeService.getDisputesForOfficer).toHaveBeenCalledWith('officerTest1', expect.any(Object));
      expect(screen.getByText('Late shipment item')).toBeInTheDocument();
      expect(screen.getByText('Item not as described fully')).toBeInTheDocument();
    });
    
    expect(screen.queryByText('Premium Insights')).not.toBeInTheDocument();
    expect(screen.queryByText('Show Heatmap')).not.toBeInTheDocument();
    expect(logger.default.info).toHaveBeenCalledWith('[DisputeRadarWidget] Fetching disputes for officerId: officerTest1');
  });

  it('renders correctly for premium users and shows premium features', async () => {
    render(<DisputeRadarWidget officerId="officerPremium1" isPremium={true} />);
    expect(screen.getByText('Dispute Radar')).toBeInTheDocument();

    await waitFor(() => {
      expect(DisputeService.getPredictiveHotspots).toHaveBeenCalledWith('officerPremium1', expect.any(Object));
      expect(screen.getByText('Premium Insights')).toBeInTheDocument();
      expect(screen.getByText('Predictive Hotspot Alerts:')).toBeInTheDocument();
      expect(screen.getByText(/Potential hotspot: High severity item condition disputes/i)).toBeInTheDocument();
    });
    expect(screen.getByText('Show Heatmap')).toBeInTheDocument();
  });

  it('initializes WebSocket connection on mount and registers handlers', () => {
    render(<DisputeRadarWidget officerId="officerWS1" isPremium={false} />);
    expect(LiveUpdates).toHaveBeenCalledWith('/ws/disputes/updates');
    expect(mockLiveUpdatesInstance.connect).toHaveBeenCalledTimes(1);
    expect(mockLiveUpdatesInstance.on).toHaveBeenCalledWith('new_dispute', expect.any(Function));
    expect(mockLiveUpdatesInstance.on).toHaveBeenCalledWith('dispute_update', expect.any(Function));
    expect(mockLiveUpdatesInstance.on).toHaveBeenCalledWith('error', expect.any(Function));
  });

  it('handles new dispute from WebSocket and updates the list', async () => {
    render(<DisputeRadarWidget officerId="officerWS2" isPremium={false} />);
    await waitFor(() => expect(DisputeService.getDisputesForOfficer).toHaveBeenCalled()); // Ensure initial load

    const newDisputePayload = { id: 'd4-ws', description: 'New WebSocket dispute live', type: 'communication', severity: 'low', createdAt: Date.now() };
    
    act(() => {
      newDisputeHandler(newDisputePayload); // Manually trigger the captured handler
    });

    await waitFor(() => {
      expect(screen.getByText('New WebSocket dispute live')).toBeInTheDocument();
    });
    expect(logger.default.info).toHaveBeenCalledWith('[DisputeRadarWidget] Received new dispute via WebSocket:', newDisputePayload);
  });
  
  it('handles dispute update from WebSocket and modifies existing dispute', async () => {
    render(<DisputeRadarWidget officerId="officerWS3" isPremium={false} />);
    await waitFor(() => expect(screen.getByText('Late shipment item')).toBeInTheDocument());

    const updatedDisputePayload = { id: 'd1', description: 'Late shipment item - UPDATED', type: 'shipping', severity: 'high', createdAt: mockDisputesInitial[0].createdAt };
    
    act(() => {
      disputeUpdateHandler(updatedDisputePayload);
    });

    await waitFor(() => {
      expect(screen.getByText('Late shipment item - UPDATED')).toBeInTheDocument();
      expect(screen.queryByText('Late shipment item')).not.toBeInTheDocument(); // Original description should be gone
    });
     expect(logger.default.info).toHaveBeenCalledWith('[DisputeRadarWidget] Received new dispute via WebSocket:', updatedDisputePayload); // Uses same log for updates
  });

  it('handles WebSocket error and displays message', async () => {
    render(<DisputeRadarWidget officerId="officerWSError1" isPremium={false} />);
    await waitFor(() => expect(DisputeService.getDisputesForOfficer).toHaveBeenCalled());

    act(() => {
      wsErrorHandler({ message: 'WebSocket connection failed abruptly' });
    });

    await waitFor(() => {
      expect(screen.getByText('Real-time updates are currently unavailable.')).toBeInTheDocument();
    });
    expect(logger.default.error).toHaveBeenCalledWith('[DisputeRadarWidget] WebSocket error:', { message: 'WebSocket connection failed abruptly' });
  });

  it('cleans up WebSocket connection on unmount', () => {
    const { unmount } = render(<DisputeRadarWidget officerId="officerUnmount1" isPremium={false} />);
    unmount();
    expect(mockLiveUpdatesInstance.disconnect).toHaveBeenCalledTimes(1);
    expect(logger.default.info).toHaveBeenCalledWith('[DisputeRadarWidget] Closing WebSocket connection.');
  });

  it('filters disputes by type correctly', async () => {
    render(<DisputeRadarWidget officerId="officerFilter1" isPremium={false} />);
    await waitFor(() => expect(screen.getByText('Late shipment item')).toBeInTheDocument());

    const typeFilter = screen.getByLabelText('Type');
    fireEvent.change(typeFilter, { target: { value: 'shipping' } });

    await waitFor(() => {
      expect(screen.getByText('Late shipment item')).toBeInTheDocument();
      expect(screen.queryByText('Item not as described fully')).not.toBeInTheDocument();
      expect(screen.queryByText('Payment processing issue')).not.toBeInTheDocument();
    });
  });

  it('filters disputes by severity correctly', async () => {
    render(<DisputeRadarWidget officerId="officerFilter2" isPremium={false} />);
    await waitFor(() => expect(screen.getByText('Late shipment item')).toBeInTheDocument());

    const severityFilter = screen.getByLabelText('Severity');
    fireEvent.change(severityFilter, { target: { value: 'high' } });

    await waitFor(() => {
      expect(screen.queryByText('Late shipment item')).not.toBeInTheDocument(); // medium
      expect(screen.getByText('Item not as described fully')).toBeInTheDocument(); // high
      expect(screen.getByText('Payment processing issue')).toBeInTheDocument(); // high
    });
  });
  
  it('filters disputes by timeframe (last7d)', async () => {
    const now = Date.now();
    const specificMockDisputes = [
      { id: 'd_tf1', description: 'Recent dispute (2 days ago)', type: 'shipping', severity: 'medium', createdAt: now - 2 * 24 * 60 * 60 * 1000 },
      { id: 'd_tf2', description: 'Old dispute (10 days ago)', type: 'item_condition', severity: 'high', createdAt: now - 10 * 24 * 60 * 60 * 1000 },
      { id: 'd_tf3', description: 'Very recent (12 hours ago)', type: 'payment', severity: 'low', createdAt: now - 12 * 60 * 60 * 1000 },
    ];
    DisputeService.getDisputesForOfficer.mockResolvedValue(specificMockDisputes);
    render(<DisputeRadarWidget officerId="officerFilterTime" isPremium={false} />);
    
    await waitFor(() => {
      expect(screen.getByText('Recent dispute (2 days ago)')).toBeInTheDocument();
      expect(screen.getByText('Old dispute (10 days ago)')).toBeInTheDocument();
      expect(screen.getByText('Very recent (12 hours ago)')).toBeInTheDocument();
    });

    const timeframeFilter = screen.getByLabelText('Timeframe');
    fireEvent.change(timeframeFilter, { target: { value: 'last7d' } });

    await waitFor(() => {
      expect(screen.getByText('Recent dispute (2 days ago)')).toBeInTheDocument();
      expect(screen.getByText('Very recent (12 hours ago)')).toBeInTheDocument();
      expect(screen.queryByText('Old dispute (10 days ago)')).not.toBeInTheDocument();
    });
  });

  it('displays error message when fetching disputes fails', async () => {
    DisputeService.getDisputesForOfficer.mockRejectedValueOnce(new Error('Network API Error'));
    render(<DisputeRadarWidget officerId="officerErrorFetch" isPremium={false} />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load disputes. Please try again later.')).toBeInTheDocument();
    });
    expect(logger.default.error).toHaveBeenCalledWith('[DisputeRadarWidget] Error fetching disputes:', expect.any(Error));
  });

  it('toggles heatmap visibility for premium users and shows conceptual data', async () => {
    render(<DisputeRadarWidget officerId="officerPremiumHeatmap" isPremium={true} />);
    await waitFor(() => expect(screen.getByText('Show Heatmap')).toBeInTheDocument());

    const heatmapButton = screen.getByText('Show Heatmap');
    fireEvent.click(heatmapButton);

    await waitFor(() => {
      expect(screen.getByText('Dispute Heatmap (Conceptual)')).toBeInTheDocument();
      expect(screen.getByText('Hide Heatmap')).toBeInTheDocument();
      // Check for conceptual heatmap data based on mockDisputesInitial
      // Example: 'shipping' type has 1 dispute, 'item_condition' has 1, 'payment' has 1
      expect(screen.getByText('shipping')).toBeInTheDocument();
      expect(screen.getAllByText('Count: 1')[0]).toBeInTheDocument(); // First item with count 1
      expect(screen.getByText('item_condition')).toBeInTheDocument();
      expect(screen.getByText('payment')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Hide Heatmap'));
    await waitFor(() => {
      expect(screen.queryByText('Dispute Heatmap (Conceptual)')).not.toBeInTheDocument();
      expect(screen.getByText('Show Heatmap')).toBeInTheDocument();
    });
  });
  
  it('handles empty disputes array from service gracefully', async () => {
    DisputeService.getDisputesForOfficer.mockResolvedValueOnce([]);
    DisputeService.getPredictiveHotspots.mockResolvedValueOnce([]); // For premium
    render(<DisputeRadarWidget officerId="officerEmpty1" isPremium={true} />);

    await waitFor(() => {
      expect(screen.getByText(/No disputes match the current filters, or no disputes found./i)).toBeInTheDocument();
      expect(screen.getByText('No active hotspot alerts at this time.')).toBeInTheDocument(); // For premium
    });
  });

  it('handles null or undefined disputes from service by defaulting to empty arrays', async () => {
    DisputeService.getDisputesForOfficer.mockResolvedValueOnce(null);
    DisputeService.getPredictiveHotspots.mockResolvedValueOnce(undefined);
    render(<DisputeRadarWidget officerId="officerNull1" isPremium={true} />);

    await waitFor(() => {
      expect(screen.getByText(/No disputes match the current filters, or no disputes found./i)).toBeInTheDocument();
      expect(screen.getByText('No active hotspot alerts at this time.')).toBeInTheDocument();
    });
     // Check that logger was not called with an error for this specific case, but for fetching.
    expect(logger.default.error).not.toHaveBeenCalledWith(expect.stringContaining('Cannot read properties of null'), expect.any(Object));
  });

});

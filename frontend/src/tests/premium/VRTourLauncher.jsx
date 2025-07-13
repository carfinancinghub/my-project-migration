// File: VRTourLauncher.test.jsx
// Path: C:\CFH\frontend\src\tests\premium\VRTourLauncher.test.jsx
// Purpose: Unit tests for VRTourLauncher component
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import VRTourLauncher from '@components/premium/VRTourLauncher';
import { createVRTour, startVRTour } from '@services/api/premium';
import logger from '@utils/logger';

jest.mock('@services/api/premium');
jest.mock('@utils/logger');

describe('VRTourLauncher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders launch button initially', () => {
    render(<VRTourLauncher userId="123" vehicleId="789" />);
    expect(screen.getByText(/Launch VR Tour/i)).toBeInTheDocument();
  });

  it('shows loading state while launching tour', async () => {
    createVRTour.mockResolvedValueOnce({ tourId: 'vr-tour-123' });
    startVRTour.mockResolvedValueOnce({ vrTourUrl: 'vr://tour-123' });

    render(<VRTourLauncher userId="123" vehicleId="789" />);
    fireEvent.click(screen.getByText(/Launch VR Tour/i));
    expect(screen.getByText(/Launching VR tour/i)).toBeInTheDocument();
  });

  it('renders VR tour link after successful launch', async () => {
    createVRTour.mockResolvedValueOnce({ tourId: 'vr-tour-123' });
    startVRTour.mockResolvedValueOnce({ vrTourUrl: 'vr://tour-123' });

    render(<VRTourLauncher userId="123" vehicleId="789" />);
    fireEvent.click(screen.getByText(/Launch VR Tour/i));
    await waitFor(() => {
      expect(screen.getByText(/Enter VR Tour/i)).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveAttribute('href', 'vr://tour-123');
    });
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Launched VR tour'));
  });

  it('renders error message on launch failure', async () => {
    createVRTour.mockRejectedValueOnce(new Error('API error'));
    render(<VRTourLauncher userId="123" vehicleId="789" />);
    fireEvent.click(screen.getByText(/Launch VR Tour/i));
    await waitFor(() => {
      expect(screen.getByText(/Failed to launch VR tour/i)).toBeInTheDocument();
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to launch VR tour'));
    });
  });

  it('requires userId and vehicleId props', () => {
    expect(VRTourLauncher.propTypes.userId).toBe(PropTypes.string.isRequired);
    expect(VRTourLauncher.propTypes.vehicleId).toBe(PropTypes.string.isRequired);
  });
});
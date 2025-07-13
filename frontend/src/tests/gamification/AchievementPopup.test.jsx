/**
 * File: AchievementPopup.test.jsx
 * Path: C:\CFH\frontend\src\tests\gamification\AchievementPopup.test.jsx
 * Purpose: Unit tests for the AchievementPopup component displaying badge achievement pop-ups.
 * Author: Rivers Auction Dev Team
 * Date: 2025-05-21
 * Cod2 Crown Certified: Yes
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AchievementPopup from '@components/gamification/AchievementPopup';
import logger from '@utils/logger';

const mockClose = jest.fn();

describe('AchievementPopup Component', () => {
  const badgeName = 'Top Bidder';
  const badgeId = 'badge123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the pop-up with the badge name', () => {
    render(<AchievementPopup badgeId={badgeId} badgeName={badgeName} onClose={mockClose} />);
    expect(screen.getByText('Congratulations!')).toBeInTheDocument();
    expect(screen.getByText(`You earned the ${badgeName} badge!`)).toBeInTheDocument();
  });

  it('auto-closes after 5 seconds and calls onClose', () => {
    jest.useFakeTimers();
    render(<AchievementPopup badgeId={badgeId} badgeName={badgeName} onClose={mockClose} />);
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(mockClose).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it('calls onClose when "Close" button is clicked', () => {
    render(<AchievementPopup badgeId={badgeId} badgeName={badgeName} onClose={mockClose} />);
    const button = screen.getByText('Close');
    fireEvent.click(button);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('handles render failure gracefully and displays error message', () => {
    const errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => {});
    const FaultyComponent = () => {
      throw new Error('Render failure');
    };

    const FaultyPopup = () => (
      <AchievementPopup badgeId={null} badgeName={null} onClose={mockClose}>
        <FaultyComponent />
      </AchievementPopup>
    );

    expect(() => render(<FaultyPopup />)).not.toThrow();
    expect(errorSpy).toHaveBeenCalled();
  });
});

AchievementPopup.propTypes = {};
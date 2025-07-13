// File: PredictiveGraph.test.jsx
// Path: C:\CFH\frontend\src\tests\components\common\PredictiveGraph.test.jsx
// Purpose: Unit tests for PredictiveGraph.jsx, covering graph rendering, tooltips, and export
// Author: Rivers Auction Dev Team
// Date: 2025-05-27
// Cod2 Crown Certified: Yes
// Save Location: This file should be saved to C:\CFH\frontend\src\tests\components\common\PredictiveGraph.test.jsx to test the PredictiveGraph.jsx component.

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PredictiveGraph from '@components/common/PredictiveGraph';
import Chart from 'chart.js/auto';
import logger from '@utils/logger';

jest.mock('chart.js/auto');
jest.mock('@utils/logger');

describe('PredictiveGraph', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Chart.mockImplementation(() => ({
      toBase64Image: jest.fn().mockReturnValue('data:image/png;base64,test'),
      destroy: jest.fn(),
    }));
  });

  const mockData = [
    { date: '2025-05-01', value: 100 },
    { date: '2025-05-02', value: 120 },
  ];

  it('renders graph with data', () => {
    render(<PredictiveGraph data={mockData} />);
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Predictive graph');
    expect(screen.getByRole('button', { name: /Export as PNG/ })).toBeInTheDocument();
  });

  it('exports graph as PNG', () => {
    const { getByText } = render(<PredictiveGraph data={mockData} />);
    const exportButton = getByText('Export as PNG');
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({ href: '', download: '', click: jest.fn() });
    fireEvent.click(exportButton);
    expect(logger.info).toHaveBeenCalledWith('Graph exported as PNG');
    expect(createElementSpy).toHaveBeenCalledWith('a');
    createElementSpy.mockRestore();
  });

  it('handles invalid data gracefully', () => {
    render(<PredictiveGraph data={[]} />);
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Data formatting failed'));
    expect(screen.getByRole('region')).toBeInTheDocument();
  });
});

PredictiveGraph.test.propTypes = {};
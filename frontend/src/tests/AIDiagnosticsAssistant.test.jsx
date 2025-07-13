// File: AIDiagnosticsAssistant.test.jsx
// Path: frontend/src/tests/AIDiagnosticsAssistant.test.jsx
// Author: Cod1 (05051135)
// Purpose: Unit test for AI Diagnostics Assistant to validate rendering

import React from 'react';
import { render, screen } from '@testing-library/react';
import AIDiagnosticsAssistant from '@components/mechanic/AIDiagnosticsAssistant';

describe('AIDiagnosticsAssistant', () => {
  it('renders AI Diagnostics Assistant title', () => {
    render(<AIDiagnosticsAssistant />);
    expect(screen.getByText(/AI Diagnostics Assistant/i)).toBeInTheDocument();
  });
});

// File: HaulerCollaboration.test.jsx
// Path: frontend/src/tests/HaulerCollaboration.test.jsx
// Author: Cod1 (05051135)
// Purpose: Unit test for hauler collaboration form interaction

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HaulerCollaboration from '@components/mechanic/HaulerCollaboration';

describe('HaulerCollaboration', () => {
  it('renders hauler notification form and handles input', () => {
    render(<HaulerCollaboration />);

    fireEvent.change(screen.getByLabelText(/Vehicle ID/i), {
      target: { value: 'TEST123' }
    });
    fireEvent.change(screen.getByLabelText(/Issue Description/i), {
      target: { value: 'Brake issue' }
    });

    expect(screen.getByDisplayValue('TEST123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Brake issue')).toBeInTheDocument();
  });
});

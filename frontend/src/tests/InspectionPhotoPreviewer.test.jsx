/**
 * File: InspectionPhotoPreviewer.test.jsx
 * Path: frontend/src/tests/InspectionPhotoPreviewer.test.jsx
 * Purpose: Jest tests for the InspectionPhotoPreviewer component in the Mechanic role
 * Author: Cod1 (05052350)
 * Date: May 05, 2025
 * Cod2 Crown Certified
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InspectionPhotoPreviewer from '@components/mechanic/InspectionPhotoPreviewer';

// --- Tests for InspectionPhotoPreviewer ---
describe('InspectionPhotoPreviewer', () => {
  it('renders input fields and upload button', () => {
    render(<InspectionPhotoPreviewer />);
    expect(screen.getByPlaceholderText('Enter Inspection ID')).toBeInTheDocument();
    expect(screen.getByText('Upload Photos')).toBeInTheDocument();
  });

  it('shows error if trying to upload without photos or inspection ID', () => {
    render(<InspectionPhotoPreviewer />);
    fireEvent.click(screen.getByText('Upload Photos'));
    expect(screen.getByText('Upload Status: Failed')).toBeInTheDocument();
  });
});

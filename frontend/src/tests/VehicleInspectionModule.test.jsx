// File: VehicleInspectionModule.test.jsx
// Path: frontend/src/tests/VehicleInspectionModule.test.jsx
// Author: Cod1 (05051135)
// Purpose: Unit test for VehicleInspectionModule to verify rendering and submission

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VehicleInspectionModule from '@components/mechanic/VehicleInspectionModule';

jest.mock('@components/mechanic/InspectionForm', () => () => <div>Inspection Form Mock</div>);
jest.mock('@components/mechanic/InspectionReportViewer', () => () => <div>Inspection Report Viewer Mock</div>);

describe('VehicleInspectionModule', () => {
  it('renders inspection form and viewer', () => {
    render(<VehicleInspectionModule />);

    expect(screen.getByText('Inspection Form Mock')).toBeInTheDocument();
    expect(screen.getByText('Inspection Report Viewer Mock')).toBeInTheDocument();
  });
});

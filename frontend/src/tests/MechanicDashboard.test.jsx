// File: MechanicDashboard.test.jsx
// Path: frontend/src/tests/MechanicDashboard.test.jsx
// Author: Cod1 (05051140)
// Purpose: Unit tests for MechanicDashboard UI, photo upload preview logic, and premium feature gating

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MechanicDashboard from '@components/mechanic/MechanicDashboard';
import { PremiumFeatureContext } from '@components/common/PremiumFeature';
import { LanguageProvider } from '@components/common/MultiLanguageSupport';

jest.mock('@components/mechanic/VehicleInspectionModule', () => () => <div data-testid="VehicleInspectionModule" />);
jest.mock('@components/mechanic/AIDiagnosticsAssistant', () => () => <div data-testid="AIDiagnosticsAssistant" />);
jest.mock('@components/mechanic/VehicleHealthTrendCharts', () => () => <div data-testid="VehicleHealthTrendCharts" />);
jest.mock('@components/mechanic/RepairScheduler', () => () => <div data-testid="RepairScheduler" />);
jest.mock('@components/mechanic/HaulerCollaboration', () => () => <div data-testid="HaulerCollaboration" />);

const renderWithContext = (isPro = false, isEnterprise = false) => {
  render(
    <PremiumFeatureContext.Provider value={{ isPremium: (feature) => {
      if (feature === 'mechanicPro') return isPro;
      if (feature === 'mechanicEnterprise') return isEnterprise;
      return false;
    } }}>
      <LanguageProvider>
        <MechanicDashboard />
      </LanguageProvider>
    </PremiumFeatureContext.Provider>
  );
};

describe('MechanicDashboard Core Tests', () => {
  it('renders all free-tier sections by default', () => {
    renderWithContext();
    expect(screen.getByText(/mechanic dashboard/i)).toBeInTheDocument();
    expect(screen.getByTestId('VehicleInspectionModule')).toBeInTheDocument();
  });

  it('gates diagnostics and trends based on premium', () => {
    renderWithContext(false, false);
    fireEvent.click(screen.getByText(/diagnostics/i));
    expect(screen.queryByTestId('AIDiagnosticsAssistant')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(/trends/i));
    expect(screen.queryByTestId('VehicleHealthTrendCharts')).not.toBeInTheDocument();

    renderWithContext(true, true);
    fireEvent.click(screen.getByText(/diagnostics/i));
    expect(screen.getByTestId('AIDiagnosticsAssistant')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/trends/i));
    expect(screen.getByTestId('VehicleHealthTrendCharts')).toBeInTheDocument();
  });
});

describe('MechanicDashboard Photo Upload Preview Logic', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('handles drag-and-drop file input and preview', async () => {
    const mockFile = new File(['dummy'], 'preview.jpg', { type: 'image/jpeg' });
    const ImageUploader = require('@components/common/ImageUploader').default;

    jest.mock('@components/common/ImageUploader', () => ({
      __esModule: true,
      default: ({ onDrop }) => (
        <div>
          <button onClick={() => onDrop([mockFile])}>Upload Image</button>
          <img src="preview.jpg" alt="preview" data-testid="preview-img" />
        </div>
      )
    }));

    renderWithContext();
    fireEvent.click(screen.getByText(/upload image/i));

    await waitFor(() => {
      expect(screen.getByTestId('preview-img')).toBeInTheDocument();
    });
  });

  it('shows error message on invalid file type', async () => {
    const mockFile = new File(['text'], 'file.txt', { type: 'text/plain' });
    const ImageUploader = require('@components/common/ImageUploader').default;

    jest.mock('@components/common/ImageUploader', () => ({
      __esModule: true,
      default: ({ onDrop }) => (
        <div>
          <button onClick={() => onDrop([mockFile])}>Upload Invalid</button>
          <p data-testid="error-message">❌ Invalid file type</p>
        </div>
      )
    }));

    renderWithContext();
    fireEvent.click(screen.getByText(/upload invalid/i));
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });
});

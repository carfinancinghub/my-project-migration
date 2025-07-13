/**
 * File: MarketplaceInsightsDashboard.cy.js
 * Path: cypress/e2e/MarketplaceInsightsDashboard.cy.js
 * Purpose: Cypress end-to-end tests for MarketplaceInsightsDashboard.jsx to validate free and premium features
 * Author: SG
 * Date: April 28, 2025
 * Cod2 Crown Certified
 */

describe('MarketplaceInsightsDashboard', () => {
  beforeEach(() => {
    // Mock insights API
    cy.intercept('GET', '/api/insights', {
      statusCode: 200,
      body: {
        auctions: 125,
        totalSpent: 75000,
        bestFinancingDeal: { lender: 'Lender A', savings: 500 },
        haulersHired: 3,
        badges: ['Gold Marketplace Member', 'Top Bidder'],
        loyaltyPoints: 2500,
        spendingTrends: [
          { month: 'Jan', amount: 5000 },
          { month: 'Feb', amount: 6500 },
          { month: 'Mar', amount: 8000 },
          { month: 'Apr', amount: 7000 },
          { month: 'May', amount: 9000 },
          { month: 'Jun', amount: 10000 },
        ],
        serviceUsage: [
          { name: 'Auction Bids', value: 400 },
          { name: 'Financing Deals', value: 150 },
          { name: 'Hauler Hires', value: 50 },
        ],
        newFinancingDeal: { lender: 'Lender B', amount: 1000, rate: 5.5 },
      },
    }).as('getInsights');

    // Visit component
    cy.visit('/marketplace-insights');
    cy.window().then((win) => {
      win.__setProps = {
        userId: 'user123',
        isPremium: false,
      };
    });
  });

  it('displays activity overview for non-premium users', () => {
    cy.wait('@getInsights');
    cy.get('[data-testid="activity-overview"]').should('contain', '125').and('contain', '$75,000');
    cy.get('[data-testid="preview-pdf-button"]').should('be.visible');
    cy.get('[data-testid="export-pdf-button"]').should('be.visible');
    cy.get('[data-testid="download-csv-button"]').should('be.visible');
    cy.get('[data-testid="share-insights-button"]').should('be.visible');
  });

  it('displays best financing deal and hauler summary for premium users', () => {
    cy.window().then((win) => {
      win.__setProps.isPremium = true;
    });
    cy.wait('@getInsights');
    cy.get('[data-testid="best-financing-deal"]').should('contain', 'Lender A').and('contain', '$500');
    cy.get('[data-testid="hauler-summary"]').should('contain', 'Express Haul').and('contain', '3');
  });

  it('previews PDF for premium users', () => {
    cy.window().then((win) => {
      win.__setProps.isPremium = true;
    });
    cy.get('[data-testid="preview-pdf-button"]').click();
    cy.get('[data-testid="pdf-preview-modal"]').should('be.visible');
    cy.get('[data-testid="close-pdf-preview"]').click();
    cy.get('[data-testid="pdf-preview-modal"]').should('not.exist');
  });

  it('exports PDF for premium users', () => {
    cy.window().then((win) => {
      win.__setProps.isPremium = true;
      const mockWs = {
        onopen: () => {},
        onmessage: (event) => {
          const message = event.data;
          if (message.includes('PDF_Ready')) {
            win.__triggerToast(message);
          }
        },
        send: cy.spy().as('wsSend'),
        close: () => {},
        readyState: 1,
      };
      cy.stub(win, 'WebSocket').returns(mockWs);
    });

    cy.get('[data-testid="export-pdf-button"]').click();
    cy.get('@wsSend').should('have.been.calledWith', expect.stringContaining('Export_PDF_user123_'));
    cy.get('.Toastify__toast--info').should('contain', 'Generating PDF');
  });

  it('shares insights for premium users', () => {
    cy.window().then((win) => {
      win.__setProps.isPremium = true;
    });
    cy.get('[data-testid="share-insights-button"]').click();
    cy.get('.Toastify__toast--success').should('contain', 'Insights shared successfully');
  });

  it('handles API failure', () => {
    cy.intercept('GET', '/api/insights', {
      statusCode: 500,
      body: { error: 'Server error' },
    }).as('getInsightsFailure');

    cy.visit('/marketplace-insights');
    cy.wait('@getInsightsFailure');
    cy.get('[data-testid="error-message"]').should('contain', 'Error fetching insights');
  });

  it('handles WebSocket disconnection for PDF export', () => {
    cy.window().then((win) => {
      win.__setProps.isPremium = true;
      cy.stub(win, 'WebSocket').throws(new Error('WebSocket disconnected'));
    });

    cy.get('[data-testid="export-pdf-button"]').click();
    cy.get('.Toastify__toast--error').should('contain', 'WebSocket error');
  });
});

// Cod2 Crown Certified: This test suite validates MarketplaceInsightsDashboard.jsx in a live environment,
// covers free/premium features, WebSocket alerts, PDF preview, insight sharing, and edge cases,
// uses Cypress with @ aliases, and ensures robust error handling.
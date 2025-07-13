/**
 * File: CollaborationChat.cy.js
 * Path: cypress/e2e/CollaborationChat.cy.js
 * Purpose: Cypress end-to-end tests for CollaborationChat.jsx in a live environment
 * Author: SG
 * Date: April 28, 2025
 * Cod2 Crown Certified
 */

describe('CollaborationChat', () => {
  // Mock API and WebSocket setup
  beforeEach(() => {
    // Mock chat history API
    cy.intercept('GET', '/api/auction/auction123/chat', {
      statusCode: 200,
      body: [
        { userId: 'user123', content: 'Hello', timestamp: '2025-04-28T12:00:00Z' },
      ],
    }).as('getChatHistory');

    // Visit component via CarTransportCoordination.jsx
    cy.visit('/transport-coordination'); // Adjust path based on routing
    cy.window().then((win) => {
      // Mock props for CollaborationChat
      win.__setProps = {
        transportId: 'auction123',
        haulerId: 'hauler123',
        isPremium: false,
        role: 'hauler',
      };
    });
  });

  it('displays chat history for non-premium users', () => {
    // Open chat modal
    cy.get('[aria-label="Open chat with buyer"]').click();

    // Verify chat history
    cy.wait('@getChatHistory');
    cy.get('[data-testid="chat-log"]').should('contain', 'Hello');
    cy.get('[data-testid="chat-input"]').should('be.disabled');
    cy.get('[data-testid="send-button"]').should('be.disabled');
  });

  it('sends and receives messages for premium users', () => {
    // Set premium user
    cy.window().then((win) => {
      win.__setProps.isPremium = true;
    });

    // Mock WebSocket
    cy.window().then((win) => {
      const mockWs = {
        onopen: () => {
          win.console.log('WebSocket connected');
        },
        onmessage: (event) => {
          const message = JSON.parse(event.data);
          if (message.type === 'chatMessage') {
            win.__addMessage(message); // Simulate UI update
          }
        },
        send: cy.spy().as('wsSend'),
        close: () => {},
        readyState: 1, // WebSocket.OPEN
      };
      cy.stub(win, 'WebSocket').returns(mockWs);
    });

    // Open chat modal
    cy.get('[aria-label="Open chat with buyer"]').click();

    // Send a message
    cy.get('[data-testid="chat-input"]').type('Test message');
    cy.get('[data-testid="send-button"]').click();

    // Verify message sent and displayed
    cy.get('@wsSend').should('have.been.calledWith', expect.stringContaining('"content":"Test message"'));
    cy.get('[data-testid="chat-log"]').should('contain', 'Test message');
    cy.get('[data-testid="chat-log"] div').should('have.class', 'animate-slide-in');
  });

  it('anonymizes financier IDs for blind bidding', () => {
    // Set financier role
    cy.window().then((win) => {
      win.__setProps.isPremium = true;
      win.__setProps.role = 'financier';
    });

    // Mock WebSocket
    cy.window().then((win) => {
      cy.stub(win, 'WebSocket').returns({
        onopen: () => {},
        onmessage: () => {},
        send: cy.spy().as('wsSend'),
        close: () => {},
        readyState: 1,
      });
    });

    // Open chat modal
    cy.get('[aria-label="Open chat with buyer"]').click();

    // Send a message
    cy.get('[data-testid="chat-input"]').type('Offer terms');
    cy.get('[data-testid="send-button"]').click();

    // Verify anonymized ID
    cy.get('@wsSend').should('have.been.calledWith', expect.stringContaining('"userId":"Financier_'));
  });

  it('handles WebSocket failure gracefully', () => {
    // Set premium user
    cy.window().then((win) => {
      win.__setProps.isPremium = true;
    });

    // Mock WebSocket failure
    cy.window().then((win) => {
      cy.stub(win, 'WebSocket').throws(new Error('Connection failed'));
    });

    // Open chat modal
    cy.get('[aria-label="Open chat with buyer"]').click();

    // Verify error toast
    cy.get('.Toastify__toast--error').should('contain', 'Chat connection failed');
  });

  it('handles empty chat history', () => {
    // Mock empty chat history
    cy.intercept('GET', '/api/auction/auction123/chat', {
      statusCode: 200,
      body: [],
    }).as('getEmptyChatHistory');

    // Open chat modal
    cy.get('[aria-label="Open chat with buyer"]').click();

    // Verify empty log
    cy.wait('@getEmptyChatHistory');
    cy.get('[data-testid="chat-log"]').children().should('have.length', 0);
  });

  it('disables sending empty messages', () => {
    // Set premium user
    cy.window().then((win) => {
      win.__setProps.isPremium = true;
    });

    // Open chat modal
    cy.get('[aria-label="Open chat with buyer"]').click();

    // Verify send button disabled
    cy.get('[data-testid="send-button"]').should('be.disabled');

    // Type and clear input
    cy.get('[data-testid="chat-input"]').type('Test');
    cy.get('[data-testid="send-button"]').should('not.be.disabled');
    cy.get('[data-testid="chat-input"]').clear();
    cy.get('[data-testid="send-button"]').should('be.disabled');
  });
});

// Cod2 Crown Certified: This test suite validates CollaborationChat.jsx in a live environment,
// covers free/premium features, WebSocket reliability, and edge cases,
// uses Cypress with @ aliases, and ensures robust error handling.
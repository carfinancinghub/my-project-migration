CollaborationChat
Overview
Real-time negotiation chat between buyers and service providers, integrated into CarTransportCoordination.jsx and AuctionResultsViewer.jsx.
Features

Chat History (Free): Displays historical chat messages fetched from /api/auction/:auctionId/chat.
Real-time Messaging (Premium): Sends and receives messages via WebSocket (@backend/socket.js).
Blind Bidding Anonymity (Premium): Anonymizes financier IDs (e.g., Financier_abc12).
Chat Moderation AI (Premium): Flags inappropriate messages (e.g., profanity, spam) using AIChatModerator.js, with moderator alerts.
Animations (Premium): Message arrival animations using TailwindCSS.
Multi-language Support: Supports English, Spanish, and French via translations (en.json, es.json, fr.json).

Tier

Free: Chat history display.
Premium: Real-time messaging, blind bidding, moderation AI, animations.

Tests

Unit Tests: CollaborationChat.test.js (frontend/src/tests/CollaborationChat.test.js) validates free/premium features, error handling, and accessibility.
End-to-End Tests: CollaborationChat.cy.js (cypress/e2e/CollaborationChat.cy.js) validates live environment functionality, including WebSocket messaging and moderation.

Version
Stable, authored by SG, Crown Certified.

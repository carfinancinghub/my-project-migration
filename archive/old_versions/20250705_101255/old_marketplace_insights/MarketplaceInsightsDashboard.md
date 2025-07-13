MarketplaceInsightsDashboard
Overview
Marketplace analytics dashboard with multi-language support, real-time sync, export, and sharing capabilities.
Features

Activity Overview (Free): Displays total auctions and total spent for non-premium users.
Best Financing Deal (Premium): Shows the best financing deal with lender and savings.
Hauler Summary (Premium): Summarizes hauler hires.
PDF/CSV Export (Premium): Exports insights to PDF or CSV, with real-time WebSocket confirmation for PDF readiness.
PDF Preview (Premium): Previews PDF content in a modal before export.
Insight Sharing (Premium): Shares insights via social media (e.g., Twitter) with a generated URL.
Charts (Premium): Visualizes spending trends (BarChart) and service usage (PieChart) using recharts.
Multi-language Support: Supports English, Spanish, and French via translations (en.json, es.json, fr.json).

Tier

Free: Basic insights (activity overview).
Enterprise: Premium analytics (best financing deal, hauler summary, exports, sharing, charts).

Tests

Unit Tests: MarketplaceInsightsDashboard.test.js (frontend/src/tests/MarketplaceInsightsDashboard.test.js) validates free/premium features, error handling, and accessibility.
End-to-End Tests: MarketplaceInsightsDashboard.cy.js (cypress/e2e/MarketplaceInsightsDashboard.cy.js) validates live environment functionality, including WebSocket alerts and PDF export.

Version
Stable v1.2, authored by Cod4, Crown Certified.

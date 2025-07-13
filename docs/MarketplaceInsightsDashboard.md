# File: MarketplaceInsightsDashboard.md
# Path: C:\CFH\docs\MarketplaceInsightsDashboard.md
# Purpose: Documentation for MarketplaceInsightsDashboard.jsx component
# Author: Cod1 Final Pass
# Date: June 3, 2025
# Cod2 Crown Certified: Yes
# Save Location: This file should be saved to C:\CFH\docs\MarketplaceInsightsDashboard.md to document the MarketplaceInsightsDashboard.jsx component.

## Purpose
The `MarketplaceInsightsDashboard` component renders a unified dashboard for the Rivers Auction platform, displaying marketplace insights for users. It supports Freemium, Premium, and Wow++ tiers, providing statistics, analytics, social sharing, export features, real-time WebSocket updates, multi-language support, and animations.

## Features
- **Freemium**:
  - Basic statistics (total auctions, total spent).
  - Badge display (e.g., Gold Marketplace Member, Top Bidder).
  - Loyalty points tracking.
- **Premium**:
  - Advanced analytics (spending trends, service usage charts).
  - PDF/CSV export and preview capabilities.
  - Social sharing via Twitter.
- **Wow++**:
  - Real-time WebSocket notifications for financing deals.
  - Animated transitions using `framer-motion`.

## Inputs
- `isPremium: Boolean` (optional, default: `false`): Enables Premium and Wow++ features when `true`.

## Outputs
- JSX Element: Renders the dashboard UI with conditional feature gating based on `isPremium`.

## Dependencies
- `react`: Core library for component rendering.
- `framer-motion`: For animations and transitions.
- `recharts`: For rendering BarChart and PieChart.
- `sonner`: For toast notifications.
- `lucide-react`: For icons (e.g., FilePdf, Share2).
- `@components/common/Button`: Custom button component.
- `@components/common/PremiumFeature`: Feature gating wrapper.
- `@components/common/LanguageSelector`: Language selection UI.
- `@components/common/MultiLanguageSupport`: Language translation hook.
- `@components/common/PDFPreviewModal`: PDF preview modal.
- `@components/admin/layout/AdminLayout`: Admin layout wrapper.
- `@components/common/SEOHead`: SEO metadata component.
- `@components/marketplace/BestFinancingDealCard`: Financing deal display.
- `@components/marketplace/HaulerSummaryCard`: Hauler summary display.
- `@components/marketplace/BadgeDisplayPanel`: Badge and points display.
- `@components/marketplace/ActivityOverview`: Auction statistics display.
- `@utils/logger`: Error and info logging.
- `@utils/lenderExportUtils`: PDF/CSV export functions.
- `@utils/SocialShareHelper`: Social sharing utility.
- `@lib/websocket`: WebSocket connection hook.
- `@lib/utils`: Utility functions (e.g., `cn` for classNames).
- `@styles/theme`: Theme styles.
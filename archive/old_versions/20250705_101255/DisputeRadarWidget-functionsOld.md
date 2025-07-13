📘 Component: DisputeRadarWidget.jsx
Purpose
Visualize dispute clusters across auctions and roles to enhance officer oversight in the Rivers Auction platform, providing real-time insights and premium predictive tools.
Inputs

officerId: string (required) - Unique identifier for the officer.
isPremium: boolean (required) - Indicates if the user has a premium subscription.
filters: object (required) - Filter settings for disputes:
timeframe: string (e.g., 'all', 'last24h', 'last7d', 'last30d')
type: string (e.g., 'all', 'payment', 'item_condition', 'shipping')
severity: string (e.g., 'all', 'low', 'medium', 'high')



Outputs

JSX Element rendering:
Free: Dispute cluster visualization with timeframe, type, and severity filters.
Premium: Predictive hotspot alerts, heatmap visualization, resolution timeline integration.



Features

Free: Real-time dispute cluster display, client-side filtering by timeframe, type, and severity.
Premium: Hotspot alerts for potential dispute clusters, interactive heatmap showing dispute intensity, resolution timeline data.
WebSocket Updates: Real-time dispute updates via /ws/disputes/updates with retry mechanism.
Error Handling: User-friendly error messages for fetch/WebSocket failures, logged via @utils/logger.

Dependencies

react
prop-types
@components/common/DisputeDisplay - Renders dispute data.
@services/dispute/DisputeService - Fetches dispute clusters and hotspots.
@utils/logger - Logs errors and info.
@services/websocket/LiveUpdates - Manages WebSocket connections.

Author
Rivers Auction Team — May 18, 2025
Cod2 Crown Certified
Yes

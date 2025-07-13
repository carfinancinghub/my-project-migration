File: MarketplaceInsightsDashboard.functions.md

Path: C:\CFH\docs\functions\components\MarketplaceInsightsDashboard.functions.md

Purpose: Detailed function documentation for MarketplaceInsightsDashboard.jsx component

Author: Cod1 Final Pass

Date: June 3, 2025

Cod2 Crown Certified: Yes

Save Location: This file should be saved to C:\CFH\docs\functions\components\MarketplaceInsightsDashboard.functions.md to document the functions of the MarketplaceInsightsDashboard.jsx component.

Functions Summary







Function



Purpose



Inputs



Outputs



Dependencies





MarketplaceInsightsDashboard



Renders unified dashboard



isPremium: Boolean (optional, default: false)



JSX Element



react, framer-motion, recharts, sonner, lucide-react, @components/, @utils/, @lib/, @styles/





fetchInsights



Fetches mock insights data



None



Promise



@utils/logger, setInsights, setLoading, setError, useLanguage





handleExportPdf



Exports insights to PDF (Premium)



None



void



@utils/lenderExportUtils, sonner, isPremium, insights





handleExportCsv



Exports insights to CSV (Premium)



None



void



@utils/lenderExportUtils, isPremium, insights





handlePreviewPdf



Previews PDF (Premium)



None



void



@utils/lenderExportUtils, setPdfPreview, isPremium, insights





handleShareInsights



Shares via social (Premium)



None



void



@utils/SocialShareHelper, sonner, isPremium, userId





closePdfPreview



Closes PDF preview modal



None



void



setPdfPreview

Function Details

MarketplaceInsightsDashboard





Purpose: Renders the unified marketplace insights dashboard, conditionally displaying Freemium, Premium, and Wow++ features based on the isPremium prop.



Inputs:





isPremium: Boolean (optional, default: false): Enables Premium (charts, exports, sharing) and Wow++ (WebSocket alerts, animations) features.



Outputs: JSX Element rendering the dashboard UI, including statistics, badges, charts, export buttons, and modals.



Dependencies: react, framer-motion (animations), recharts (charts), sonner (toasts), lucide-react (icons), @components/common/* (Button, PremiumFeature, LanguageSelector, PDFPreviewModal, AdminLayout, SEOHead), @components/marketplace/* (BestFinancingDealCard, HaulerSummaryCard, BadgeDisplayPanel, ActivityOverview), @utils/* (logger, lenderExportUtils, SocialShareHelper), @lib/* (websocket, utils), @styles/theme.



Behavior: Conditionally renders components (e.g., charts, export buttons) using isPremium, fetches insights data, handles errors, and displays WebSocket alerts.

fetchInsights





Purpose: Asynchronously fetches mock insights data (auctions, spending, badges, etc.) for the dashboard.



Inputs: None



Outputs: Promise<void> (updates state: insights, loading, error).



Dependencies: @utils/logger (error logging), setInsights, setLoading, setError (state setters), useLanguage (translations).



Behavior: Simulates data fetch with a 1-second delay, sets mock data or error state, logs errors with logger.error.

handleExportPdf





Purpose: Exports dashboard insights to PDF for Premium users.



Inputs: None



Outputs: void



Dependencies: @utils/lenderExportUtils (exportLenderInsightsToPdf), sonner (toast), isPremium, insights.



Behavior: Triggers PDF export if isPremium and insights exist, displays toast notification.

handleExportCsv





Purpose: Exports dashboard insights to CSV for Premium users.



Inputs: None



Outputs: void



Dependencies: @utils/lenderExportUtils (exportInsightsToCsv), isPremium, insights.



Behavior: Triggers CSV export if isPremium and insights exist.

handlePreviewPdf





Purpose: Previews dashboard insights PDF for Premium users.



Inputs: None



Outputs: void



Dependencies: @utils/lenderExportUtils (exportLenderInsightsToPdf), setPdfPreview, isPremium, insights.



Behavior: Generates PDF preview if isPremium and insights exist, updates pdfPreview state.

handleShareInsights





Purpose: Shares dashboard insights via Twitter for Premium users.



Inputs: None



Outputs: void



Dependencies: @utils/SocialShareHelper (shareToPlatform), sonner (toast), isPremium, userId.



Behavior: Shares a URL with insights title if isPremium, displays toast notification.

closePdfPreview





Purpose: Closes the PDF preview modal.



Inputs: None



Outputs: void



Dependencies: setPdfPreview.



Behavior: Resets pdfPreview state to null, closing the modal.
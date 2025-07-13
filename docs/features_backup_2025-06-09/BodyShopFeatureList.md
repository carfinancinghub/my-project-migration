# CFH Automotive Ecosystem: Body Shop Feature List

## BodyShopDiscoveryPage.jsx
**Path**: C:\CFH\frontend\src\components\body-shop\BodyShopDiscoveryPage.jsx  
**Purpose**: React component for discovering body shops.

### Free
- Basic location search: Search by ZIP code or city.  
- View limited shop partners: Name, address, rating.  
- Limited reviews: Last 3 reviews per shop.  
- Basic filters: Rating, distance.  
- Availability alerts: Email notifications for open slots.  
- **CQS**: WCAG 2.1 AA (keyboard navigation, ARIA labels), <2s load time.  
- **Error Handling**: “No shops found” for failed searches.

### Standard
- Service-based search: Filter by collision repair, paint jobs, dents.  
- Map view: Interactive map with shop pins.  
- Shop listings: Services, primary photo.  
- Price range filter: Sort by estimated costs.  
- Auctions integration: Link to post-auction repair shops.  
- **CQS**: Input sanitization, clear headers.  
- **Error Handling**: Retry for API timeouts.

### Premium
- Advanced filters: Certifications, insurance accepted, amenities (e.g., loaner cars).  
- Unlimited search results.  
- Saved searches and new shop alerts (in-app).  
- Priority search results: Featured shops.  
- Instant quotes: View basic estimates post-search.  
- Gamification: 20 points per search (redeemable at $0.10/point).  
- **CQS**: CSP headers to prevent XSS.

### Wow++
- AI-powered shop matching: Suggest shops based on damage photos.  
- Interactive shop comparison: Ratings, pricing, services.  
- Gamification: “Shop Scout” badge for discovering new shops.  
- Monetization: $10/month for Wow++ access, contributing to $100K goal.  
- **CQS**: <1s load time, audit logging.  
- **Error Handling**: Suggest alternative shops for unavailable ones.

## BodyShopProfileView.jsx
**Path**: C:\CFH\frontend\src\components\body-shop\BodyShopProfileView.jsx  
**Purpose**: React component for viewing body shop profiles.

### Free
- Basic profile: Name, address, contact, services.  
- Limited reviews: Last 3 reviews.  
- Limited photos: 3-5 shop images.  
- **CQS**: Accessible layout (WCAG 2.1), clear labels.

### Standard
- Detailed services: Collision repair, paint, frame straightening.  
- Photo gallery: Shop, equipment, completed work.  
- Customer ratings: Aggregated scores.  
- Map integration: Shop location.  
- Online booking: Basic appointment scheduling.  
- **CQS**: <2s load time, encrypted data.  
- **Error Handling**: “No reviews found” for empty profiles.

### Premium
- Full reviews with reviewer details.  
- Extensive media: All photos/videos.  
- Certifications: I-CAR, OEM details.  
- Direct messaging: Initial shop inquiry.  
- Insurance partnerships: List accepted providers.  
- Virtual shop tour: 360-degree view.  
- “Verified by CFH” badge display.  
- Gamification: 10 points for profile exploration.  
- **CQS**: RBAC for premium access.

### Wow++
- AR certification showcase: View certifications in AR.  
- AI review summarizer: Key review themes.  
- Real-time shop cam: Live workshop view (opt-in).  
- Repair history gallery: Before/after photos.  
- Gamification: “Shop Explorer” badge for tours.  
- Monetization: $5/tour fee, contributing to $100K goal.  
- **CQS**: <1s media load, audit logging.  
- **Error Handling**: Notify for unavailable media.

## EstimateRequestForm.jsx
**Path**: C:\CFH\frontend\src\components\body-shop\EstimateRequestForm.jsx  
**Purpose**: React form for requesting repair estimates.

### Free
- Basic estimate request: Single shop, 3 photo uploads.  
- User/vehicle info: Manual entry (name, Make, Model).  
- Basic damage description.  
- Auctions integration: Pre-fill vehicle from auction.  
- **CQS**: WCAG 2.1 (screen reader support), form validation.  
- **Error Handling**: “Invalid file type” for uploads.

### Standard
- Multi-photo uploads: Up to 5 images/videos.  
- Insurance info: Optional provider/claim fields.  
- Preferred contact method selection.  
- Guided damage input: Car diagram for marking damage.  
- **CQS**: <1s form submission, input sanitization.  
- **Error Handling**: “Upload limit exceeded” alerts.

### Premium
- Multi-shop estimates: Send to 3-5 shops.  
- Unlimited uploads: Photos/videos.  
- Priority estimates: Faster shop responses.  
- Insurance integration: Direct claim submission.  
- Store/reuse requests: Save drafts.  
- Gamification: 30 points per detailed request.  
- **CQS**: Secure data encryption.

### Wow++
- AI preliminary damage assessment: Non-binding severity estimate.  
- Instant chat with experts: Real-time damage discussion ($10/chat).  
- Estimate progression notifications: Status updates (e.g., 50% complete).  
- Gamification: “Detail Master” badge for high-quality requests.  
- Monetization: $5/assessment, $10/chat, contributing to $100K goal.  
- **CQS**: <1s AI response, audit logging.  
- **Error Handling**: Retry for failed AI assessments.

## ShopOwnerDashboard.jsx
**Path**: C:\CFH\frontend\src\components\body-shop\ShopOwnerDashboard.jsx  
**Purpose**: React dashboard for body shop owners.

### Free
- Basic profile management: Name, services, hours.  
- Direct estimate requests: View/respond to single-shop requests.  
- Limited job tracking: Basic status updates.  
- Basic reporting: Job counts, daily earnings.  
- **CQS**: WCAG 2.1, role-based access.

### Standard
- Estimate management: Respond with quotes, notes.  
- Job management: Create/update jobs from estimates.  
- Basic analytics: Profile views, request counts.  
- Customer messaging: Basic communication.  
- Revenue tracking: Earnings over time.  
- **CQS**: <2s load time, input sanitization.  
- **Error Handling**: “No requests found” alerts.

### Premium
- Enhanced profile visibility: Higher search ranking.  
- “Verified by CFH” badge application.  
- Advanced analytics: Conversion rates, demographics.  
- Lead generation: Multi-shop request access.  
- Marketing tools: Create promotions.  
- Staff accounts: Multi-user management.  
- Priority job handling: High-value job prioritization.  
- API integration: Shop management software sync.  
- Gamification: 50 points for fast responses.  
- **CQS**: Secure APIs, audit logging.

### Wow++
- AI pricing insights: Local estimate ranges.  
- Automated follow-up suggestions: Customer engagement prompts.  
- Parts supplier marketplace: Order parts via CFH.  
- Gamification: “Top Shop” badge for high ratings.  
- Performance benchmarking: Compare metrics regionally.  
- Monetization: $50-$200/month subscription, contributing to $100K goal.  
- **CQS**: <1s analytics load, secure data.  
- **Error Handling**: Notify for failed integrations.

## JobTrackingView.jsx
**Path**: C:\CFH\frontend\src\components\body-shop\JobTrackingView.jsx  
**Purpose**: React component for tracking repair jobs.

### Free
- Basic job milestones: Scheduled, in-progress, complete.  
- Email/in-app notifications: Major status changes.  
- Shop contact info: Call/email shop.  
- **CQS**: WCAG 2.1, text descriptions for statuses.

### Standard
- Job status timeline: Detailed repair stages (e.g., teardown, paint).  
- Estimated completion date: Shop-updated ETA.  
- Basic communication log: Shop messages.  
- Job history log: Past repairs on vehicle.  
- **CQS**: <2s load time, encrypted data.  
- **Error Handling**: “No updates available” alerts.

### Premium
- Detailed real-time updates: Granular status changes.  
- Photo/video progress: Shop-uploaded media.  
- Direct technician line: Quick questions.  
- Refined ETA with confidence score.  
- Digital documents: Invoices, warranties.  
- Express job updates: Push notifications.  
- Gamification: 20 points for feedback.  
- **CQS**: Secure access with RBAC.

### Wow++
- Gamified progress bar: Interactive milestones.  
- “Your Car’s Journey” story: Shareable photo narrative.  
- AI predictive delay alerts: Proactive delay notifications.  
- One-click insurance update: Notify insurer of completion.  
- Gamification: “Repair Hero” badge for milestone feedback.  
- Monetization: $5/story creation, contributing to $100K goal.  
- **CQS**: <1s update load, audit logging.  
- **Error Handling**: Notify for delayed updates.

## estimateRoutes.js
**Path**: C:\cfh\backend\routes\bodyshop\estimateRoutes.js  
**Purpose**: Node.js/Express routes for repair estimates.

### Free
- `POST /bodyshop/estimates`: Single-shop request.  
- `GET /bodyshop/estimates/user/:userId`: Basic request history.  
- **CQS**: JWT authentication, rate limiting (100/hour).

### Standard
- `GET /bodyshop/estimates/shop/:shopId`: Shop’s requests.  
- `PUT /bodyshop/estimates/:estimateId/respond`: Quote submission.  
- Error handling: 400 for invalid data, 409 for conflicts.  
- **CQS**: HTTPS, <500ms response for 95% requests.

### Premium
- `POST /bodyshop/estimates/broadcast`: Multi-shop requests.  
- Priority queue: Faster processing for premium users.  
- Webhooks: Real-time request notifications.  
- `GET /bodyshop/estimates/leads`: Shop lead access.  
- Insurance integration: Claim notification support.  
- Gamification: 30 points for shop responses.  
- **CQS**: Redis caching (5-min TTL), 99.9% uptime.

### Wow++
- `POST /bodyshop/estimates/ai-assess`: AI damage assessment.  
- Automated expiry/reminder: Quote management.  
- Conflict resolution: Handle multi-shop responses.  
- Monetization: $2/API call, contributing to $100K goal.  
- **CQS**: Secure APIs, audit logging.  
- **Error Handling**: Rollback on failed assessments, 429 for rate limits.

## jobRoutes.js
**Path**: C:\cfh\backend\routes\bodyshop\jobRoutes.js  
**Purpose**: Node.js/Express routes for managing repair jobs.

### Free
- `POST /bodyshop/jobs`: Create basic job from estimate.  
- `GET /bodyshop/jobs/user/:userId`: Basic job status.  
- **CQS**: JWT authentication, rate limiting.

### Standard
- `GET /bodyshop/jobs/shop/:shopId`: Shop’s jobs.  
- `PUT /bodyshop/jobs/:jobId/status`: Status updates.  
- `POST /bodyshop/jobs/:jobId/complete`: Mark job complete.  
- Auctions integration: Post-auction job creation.  
- **Error Handling**: 409 for overbooking, 400 for invalid inputs.  
- **CQS**: HTTPS, <500ms response.

### Premium
- `POST /bodyshop/jobs/:jobId/progress-update`: Detailed notes/photos.  
- Digital documents: `POST /bodyshop/jobs/:jobId/documents`.  
- Enhanced notifications: Granular user alerts.  
- API integration: Shop management sync.  
- Gamification: 50 points for job completion.  
- **CQS**: Secure APIs, audit logging.

### Wow++
- `GET /bodyshop/jobs/predict-duration`: AI-driven ETA.  
- `POST /bodyshop/jobs/:jobId/order-parts`: Parts ordering hooks.  
- Gamification: “Job Master” badge for fast turnarounds.  
- Monetization: $5/parts order, contributing to $100K goal.  
- **CQS**: <1s API response, secure data.  
- **Error Handling**: Rollback on payment failure.

## shopProfileRoutes.js
**Path**: C:\cfh\backend\routes\bodyshop\shopProfileRoutes.js  
**Purpose**: Node.js/Express routes for body shop profiles.

### Free
- `GET /bodyshop/shops`: Basic shop search.  
- `GET /bodyshop/shops/:shopId`: Basic profile data.  
- `PUT /bodyshop/shops/:shopId`: Basic profile updates.  
- **CQS**: JWT authentication, rate limiting.

### Standard
- `POST /bodyshop/shops/:shopId/reviews`: User reviews.  
- Enhanced search: Filter by services/ratings.  
- **Error Handling**: 400 for invalid reviews, 401 for unauthorized.  
- **CQS**: HTTPS, <500ms response.

### Premium
- `PUT /bodyshop/shops/:shopId/premium-features`: Premium profile updates.  
- Enhanced listing: Priority in search results.  
- `GET /bodyshop/shops/:shopId/analytics`: Dashboard analytics.  
- Review management: Shop responses to reviews.  
- Gamification: 20 points for profile updates.  
- **CQS**: Redis caching, 99.9% uptime.

### Wow++
- `POST /bodyshop/shops/claim-listing`: Claim unmanaged profiles.  
- `POST /bodyshop/shops/:shopId/apply-certification`: “Verified by CFH” application.  
- `PUT /bodyshop/shops/:shopId/quick-service-availability`: Real-time slot updates.  
- `POST /bodyshop/shops/:shopId/qanda`: Community Q&A.  
- Gamification: “Trusted Shop” badge for engagement.  
- Monetization: $50/month for certification, contributing to $100K goal.  
- **CQS**: Secure APIs, audit logging.  
- **Error Handling**: 429 for rate limits, rollback on failed claims.
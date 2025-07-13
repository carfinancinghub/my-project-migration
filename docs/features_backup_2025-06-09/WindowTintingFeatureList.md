# CFH Automotive Ecosystem: Window Tinting Feature List

## WindowTintingScheduler.jsx
**Path**: C:\CFH\frontend\src\components\tinting\WindowTintingScheduler.jsx  
**Purpose**: React component for scheduling window tinting services.

### Free
- Basic scheduling: Book one tinting service per vehicle.  
- Standard tint options: Common types (e.g., dyed) and VLTs.  
- View general availability: Current week slots.  
- Email confirmation for bookings.  
- Appointment history: Last 3 bookings.  
- Basic cancellation: 48-hour notice.  
- **CQS**: WCAG 2.1 AA (keyboard navigation, ARIA labels), <2s load time.  
- **Error Handling**: “Slot unavailable” for conflicts.

### Standard
- Service selection: Ceramic, carbon, metallic tints; specific windows (e.g., front two).  
- Interactive calendar: Date/time selection.  
- Vehicle info: Pre-filled from CFH profile or manual (Make, Model, Year).  
- Estimated cost display: Based on tint type, vehicle size.  
- Auctions integration: Post-auction tinting with pre-filled vehicle data.  
- Real-time slot availability sync.  
- **CQS**: Input sanitization, clear headers.  
- **Error Handling**: Retry for payment failures.

### Premium
- Priority scheduling: High-demand or urgent slots.  
- Enhanced film choices: UV-blocking, heat-resistant films.  
- Add-on services: Tint removal, windshield strips.  
- SMS/in-app reminders.  
- Package deals: Multi-vehicle or bundled services.  
- Insurance integration: Damage coverage option.  
- Gamification: 50 points per booking ($0.10/point).  
- **CQS**: CSP headers to prevent XSS.

### Wow++
- AI “Perfect Match” scheduling: Pre-fills recommended tint type/VLT.  
- Tint preview tool: AI-powered tint visualization on vehicle.  
- Tinting journey tracker: Visual progress (e.g., “Tinting in Progress”).  
- Group/fleet discounts: Multi-vehicle quotes.  
- Gamification: “Tint Pro” badge for repeat bookings.  
- Warranty registration assistance: Post-service guidance.  
- Monetization: $10/month Wow++ access, $5/preview, contributing to $70K goal.  
- **CQS**: <1s form submission, audit logging.  
- **Error Handling**: Suggest alternative slots for unavailability.

## TintingServiceDiscovery.jsx
**Path**: C:\CFH\frontend\src\components\tinting\TintingServiceDiscovery.jsx  
**Purpose**: React component for discovering tinting services.

### Free
- Basic location search: ZIP code or city.  
- Limited shop listings: Name, address, rating.  
- Limited reviews: Top 3 reviews per shop.  
- Basic tint info: Educational content on types.  
- **CQS**: WCAG 2.1, <2s load time.  
- **Error Handling**: “No shops found” alerts.

### Standard
- Filter by tint type: Ceramic, carbon, dyed, metallic.  
- Filter by VLT %: 5%, 20%, 35%, 50%, 70%.  
- Map view: Interactive shop locations.  
- Shop listings: Brands, primary photo.  
- Service cost estimates: Basic pricing.  
- Auctions integration: Post-auction tinting shop links.  
- **CQS**: Secure data, clear headers.  
- **Error Handling**: Retry for API timeouts.

### Premium
- Advanced filters: Brands (e.g., 3M, Llumar), warranty, specialty tints.  
- Unlimited results and full profiles.  
- “Get Multiple Quotes” feature.  
- Exclusive listings: Featured shops.  
- Instant availability check: Real-time slots.  
- Visual tint simulator: Basic VLT preview.  
- Gamification: 20 points per search ($0.10/point).  
- **CQS**: CSP headers, RBAC.

### Wow++
- AI tint recommendation: Based on vehicle, climate, regulations.  
- AR tint visualizer: Overlay tints on user-uploaded car photo.  
- Location-based suggestions: Highest-rated nearby shops.  
- Service comparison tool: Price, ratings, films.  
- Gamification: “Tint Scout” badge for new shop reviews.  
- Local tint law pop-ups: Regional regulations.  
- Monetization: $5/visualization, contributing to $70K goal.  
- **CQS**: <1s load time, audit logging.  
- **Error Handling**: Suggest alternative shops for unavailable ones.

## tintingRoutes.js
**Path**: C:\cfh\backend\routes\tinting\tintingRoutes.js  
**Purpose**: Node.js/Express routes for managing tinting services.

### Free
- `GET /tinting/shops`: Basic shop search.  
- `GET /tinting/shops/:shopId`: Basic profile data.  
- `POST /tinting/appointments`: Single-vehicle booking.  
- `GET /tinting/appointments/user/:userId`: Basic appointment history.  
- `DELETE /tinting/appointments/:appointmentId`: Standard cancellation.  
- **CQS**: JWT authentication, rate limiting (100/hour).

### Standard
- `PUT /tinting/shops/:shopId`: Shop profile updates.  
- `POST /tinting/shops/:shopId/reviews`: User reviews.  
- `GET /tinting/appointments/shop/:shopId`: Shop’s appointments.  
- `PUT /tinting/appointments/:appointmentId`: Modify appointment.  
- `PUT /tinting/appointments/:appointmentId/status`: Status updates.  
- `GET /availableTintFilms`: List common films.  
- Auctions integration: `POST /tinting/appointments/auction-service`.  
- **Error Handling**: 400 for invalid inputs, 409 for conflicts.  
- **CQS**: HTTPS, <500ms response.

### Premium
- `POST /tinting/appointments/request-quotes`: Multi-shop quotes.  
- `POST /tinting/appointments/priority`: Priority booking.  
- `POST /tinting/appointments/fleet`: Multi-vehicle scheduling.  
- `POST /checkInsuranceForTint`: Insurance coverage check.  
- Enhanced listing: Priority in `GET /tinting/shops`.  
- Webhooks: `POST /tinting/shops/:shopId/webhooks`.  
- Analytics: `GET /tinting/shops/:shopId/analytics`.  
- Gamification: `POST /earnTintingPoints` (100 points/booking).  
- **CQS**: Redis caching (5-min TTL), 99.9% uptime.

### Wow++
- `POST /tinting/ai-recommend`: AI tint suggestions.  
- `GET /tinting/local-laws`: Regional tint regulations.  
- `POST /tinting/shops/:shopId/apply-certification`: “CFH Certified” application.  
- `POST /tinting/appointments/package`: Package deal bookings.  
- Film supplier integration: Order films for appointments.  
- Gamification: “Certified Tint Specialist” badge for shops.  
- Monetization: $2/API call, $5/package, contributing to $70K goal.  
- **CQS**: Secure APIs, audit logging.  
- **Error Handling**: 429 for rate limits, rollback on payment failure.
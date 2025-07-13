1. File: BuyerBidModal.jsx
Path: C:\CFH\frontend\src\components\buyer\BuyerBidModal.jsx
Size: ~2675 bytes
Purpose: Renders an AI-enhanced modal allowing buyers to input and submit bids, view AI bid suggestions, and optionally export bid history.
Features:

Free: Manual bid input and submission

Premium: AI bid suggestions from PredictionEngine, exportable bid history

Wow++ (Planned): Real-time competitor bid comparison
Compliance: Crown Certified, SG Man compliant (@aliases, PropTypes, logger.error, premium gating)

2. File: BuyerBidModal.test.jsx
Path: C:\CFH\frontend\src\tests\buyer\BuyerBidModal.test.jsx
Size: ~3463 bytes
Purpose: Tests bid modal rendering, AI suggestion loading, premium feature visibility, and error cases.
Tests Include:

Free rendering

Premium features (AI suggestions, export)

Error scenarios (fetch failure)

Button interactions
Compliance: Crown Certified, uses mocked services (PredictionEngine, logger), tests free/premium logic.

3. File: BuyerBidModal-functions.md
Path: C:\CFH\docs\functions\buyer\BuyerBidModal-functions.md
Size: ~1375 bytes
Purpose: Documents the component’s inputs (auctionId, isPremium), outputs (JSX with bid tools), and internal behavior.
Notes:

Includes version history and sensitive: no security flag

Tags: SG Man compliant, Crown Certified

Highlights Wow++ planning (competitor bid comparisons)

4. File: BuyerBidModal.test-functions.md
Path: C:\CFH\docs\functions\buyer\BuyerBidModal.test-functions.md
Size: ~1242 bytes
Purpose: Documents testing strategy and scenarios covered in the test suite.
Notes:

Free/premium paths, mock services, and error handling

Includes sensitive: no, Cod2 Crown Certified

Reflects SG Man QA strategy
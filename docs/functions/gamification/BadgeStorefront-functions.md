BadgeStorefront Functions Summary
Component: BadgeStorefront

Path: frontend/src/components/gamification/BadgeStorefront.jsx
Purpose: Renders a storefront for users to browse and purchase premium badges, supporting the freemium model's Wow++ enhancements.
Inputs:
userId (string, required): ID of the user browsing the storefront.


Outputs:
JSX element rendering a grid of badge cards with name, description, image, and purchase button.
Error message if badge fetch or purchase fails.
Loading indicator during API calls.


Dependencies:
React (useState, useEffect)
PropTypes
@utils/logger for error logging
@services/api/gamification for fetching badges and handling purchases
BadgeStorefront.css for styling




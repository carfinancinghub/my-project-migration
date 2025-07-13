# 📘 Component: ValuationAssistant.jsx

## Purpose  
Display AI-driven valuation metrics and predictive bidding advice for vehicles, enhancing pricing decisions for buyers, sellers, and officers.

## Inputs  
- `auctionId`: string (required)  
- `isPremium`: boolean (required)  

## Outputs  
- JSX Element rendering:  
  - **Free**: Basic valuation metrics (estimated market value, bid success probability) via `ValuationDisplay`  
  - **Premium**: Predictive trends chart (`PredictiveGraph`) and personalized bidding recommendations  

## Features  
- **Free**: Estimated market value and bid success probability  
- **Premium**:  
  - Advanced valuation insights (e.g., title processing delays, escrow sync timing)  
  - Personalized bid recommendations (e.g., “Adjust bid by 3% for optimal value”)  
- Graceful UI error handling with `logger.error`  
- WebSocket-ready for future integration (`/ws/predictions/live-updates`)

## Dependencies  
- `react`  
- `prop-types`  
- `@components/common/ValuationDisplay`  
- `@components/common/PredictiveGraph`  
- `@services/ai/PredictionEngine`  
- `@utils/logger`  

## Author  
Rivers Auction Team — May 17, 2025  

## Cod2 Crown Certified  
Yes

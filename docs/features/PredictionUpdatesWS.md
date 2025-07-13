<!--
File: PredictionUpdatesWS.md
Path: C:\CFH\docs\features\PredictionUpdatesWS.md
Purpose: Documentation for the WebSocket service handling real-time prediction updates in the CFH Automotive Ecosystem.
Author: CFH Dev Team
Date: 061925 [2359]
Version: 1.0.2
Crown Certified: Yes
Batch ID: Compliance-061925
Artifact ID: e8a7b6c5-d4f3-2e1d-0c9b-8a7f6e5d4c3b
Save Location: C:\CFH\docs\features\PredictionUpdatesWS.md
-->

# Prediction Updates WebSocket Documentation

## Purpose
Documents the `PredictionUpdatesWS.ts` WebSocket service for real-time vehicle valuation prediction updates in the CFH Automotive Ecosystem.

## Features
| Feature            | Description                                                                          |
|:-------------------|:-------------------------------------------------------------------------------------|
| Real-Time Updates  | Pushes dynamic valuation predictions to subscribed clients.                          |
| Secure Connections | Uses WSS with JWT authentication.                                                    |
| Rate Limiting      | Limits 100 connections/IP, 50 messages/sec per connection.                           |
| Scalability        | Redis pub/sub with 1000-message queue limit.                                         |
| Monitoring         | Prometheus metrics (`websocket_connections_total`, `websocket_messages_sent_total`). |
| Resilience         | Circuit breaker with 3 retries, 500ms delay for API calls.                           |

## Inputs
| Parameter         | Type    | Required | Description                                |
|:------------------|:--------|:---------|:-------------------------------------------|
| `ws`              | Object  | Yes      | WebSocket connection object.               |
| `req`             | Object  | Yes      | HTTP request with authentication headers.  |
| `message`         | JSON    | No       | Client message (e.g., subscription).       |
| `predictionData`  | JSON    | No       | Valuation prediction data.                 |

## Outputs
| Output             | Description                                      |
|:-------------------|:-------------------------------------------------|
| Real-Time Messages | JSON updates to subscribed clients.              |
| Connection Status  | Manages WebSocket lifecycle.                     |
| Error Logs         | Detailed errors via `@utils/logger`.             |
| Health Check       | `{ status: "healthy", connections: number }`.    |

## Dependencies
| Dependency         | Path/Module                    | Description                              |
|:-------------------|:-------------------------------|:-----------------------------------------|
| `ws`               | `ws`                           | WebSocket server library.                |
| `logger`           | `@utils/logger`                | Centralized logging utility.             |
| `redis`            | `@utils/redis`                 | Pub/sub for message queue.               |
| `prometheus`       | `@utils/prometheus`            | Metrics monitoring.                      |
| `circuitBreaker`   | `@utils/circuitBreaker`        | Resilience for API calls.                |
| `analyticsApi`     | `@services/analyticsApi`       | Prediction data integration.             |

## SG Man Compliance
- **Header**: Compliant with `<!-- -->` format.
- **@aliases**: Uses `@utils/logger`, `@services/analyticsApi`, etc.
- **Authentication**: JWT with X-Correlation-ID for tracing.
- **Testing**: ~95% coverage via `PredictionUpdatesWS.test.ts`, including jest-axe for `@components/PredictiveGraph`.
- **Error Handling**: Comprehensive logging, circuit breaker retries.
- **TypeScript**: Strong typing with interfaces.

## Production Readiness
- **Security**: WSS, JWT validation, rate limiting.
- **Scalability**: Redis pub/sub, 1000-message queue limit via `LTRIM`.
- **Monitoring**: Prometheus metrics, `/metrics` endpoint.
- **Resilience**: Circuit breaker with 3 retries, 500ms delay.

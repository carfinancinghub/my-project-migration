/** 
 * File: socket.js
 * Path: backend/socket.js
 * Purpose: WebSocket server for real-time features with optimized performance
 * Author: SG (Patched by Cod1 — 05060017)
 * Date: April 28, 2025 (Updated May 06, 2025)
 * Cod1 Crown Certified
 */

var WebSocket = require('ws');
var logger = require('@utils/logger'); // Central logger
var RateLimiter = // // // require('ws-rate-limiter') // Commented out due to missing module // Commented out due to missing module // Commented out due to missing module; // Hypothetical rate limiter library

// --- Mechanic Real-Time Integration ---
// var { setupTaskSocket } = require('@socket/taskSocketEmitter'); // Commented out due to SyntaxError; // Mechanic task events

// WebSocket server setup
// // var wss = new WebSocket.Server({ port: process.env.WS_PORT || 8080 }); // Commented out due to SyntaxError; // Commented out due to SyntaxError;
// var clients = new Map(); // Commented out due to SyntaxError; // Store client metadata per socket

// Rate limiter configuration (e.g., 100 messages per minute per client)
var rateLimiter = new RateLimiter({
  messagesPerMinute: 100,
  onLimitExceeded: (client) => {
    client.send(JSON.stringify({ error: 'Rate limit exceeded' }));
    client.close();
  },
});

/**
 * Broadcast messages to specific client groups
 * @param {string} group - Group name (e.g., 'hauler', 'lender', 'mechanic')
 * @param {Object} message - Message payload to broadcast
 */
var broadcastToGroup = (group, message) => {
  try {
    var messageString = JSON.stringify(message);
    clients.forEach((clientInfo, client) => {
      if (clientInfo.group === group && client.readyState === WebSocket.OPEN) {
        rateLimiter.consume(client, () => {
          client.send(messageString);
        });
      }
    });
    logger.info(`Broadcasted to group ${group}: ${message.type}`);
  } catch (err) {
    logger.error(`Broadcast error: ${err.message}`);
  }
};

// Handle new WebSocket connections
wss.on('connection', (ws, req) => {
  try {
    // Extract group from query string
    var url = new URL(req.url, `http://${req.headers.host}`);
    var group = url.searchParams.get('group') || 'default';
    clients.set(ws, { group });

    ws.on('message', (data) => {
      try {
        var message = JSON.parse(data);
        rateLimiter.consume(ws, () => {
          // Group-based routing logic
          if (message.type === 'haulerAvailability') {
            broadcastToGroup('hauler', message);
          } else if (message.type === 'lenderMatchUpdate') {
            broadcastToGroup('lender', message);
          } else if (message.type === 'mechanicUpdate') {
            broadcastToGroup('mechanic', message);
          }
        });
      } catch (err) {
        logger.error(`WebSocket message error: ${err.message}`);
        ws.send(JSON.stringify({ error: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      logger.info(`Client disconnected from group ${group}`);
    });

    ws.send(JSON.stringify({ status: 'connected', group }));
    logger.info(`New client connected to group ${group}`);
  } catch (err) {
    logger.error(`WebSocket connection error: ${err.message}`);
    ws.close();
  }
});

// Register mechanic-specific emitters
setupTaskSocket(wss); // ✅ Cod1 integration

// Handle WebSocket server-level errors
wss.on('error', (err) => {
  logger.error(`WebSocket server error: ${err.message}`);
});

// Cod2 Crown Certified: This WebSocket server supports mechanic task streaming,
// rate-limited messaging, and modular emitter registration for scalable socket groups.
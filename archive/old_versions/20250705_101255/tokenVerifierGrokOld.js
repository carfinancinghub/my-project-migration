// File: tokenVerifierGrokOld.js
// Path: backend/middleware/tokenVerifier.js

// 🔐 Lightweight JWT Verification Middleware
// Used for token-based validation without DB fetch
// Ideal for internal services, webhooks, or performance-sensitive routes

const jwt = require('jsonwebtoken');

const verifyTokenOnly = (req, res, next) => {
  // 🛡️ Extract token from Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  try {
    // 🔍 Decode the JWT using your app's secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🧬 Attach decoded payload to req.user
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyTokenOnly;

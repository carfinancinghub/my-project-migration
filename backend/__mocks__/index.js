// __mocks__/index.js
const express = require('express');
const app = express();
app.get('/user/profile', (req, res) => res.status(200).json({ success: true }));
app.get('/arbitrators', (req, res) => res.status(200).json({ success: true }));
app.get('/onboarding', (req, res) => res.status(200).json({ success: true }));
module.exports = app;

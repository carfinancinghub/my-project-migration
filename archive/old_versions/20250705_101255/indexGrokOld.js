// File: index.jsx
// Path: frontend/src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // ✅ exact filename match now

import './index.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

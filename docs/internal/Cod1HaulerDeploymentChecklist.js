// File: Cod1HaulerDeploymentChecklist.js
// Path: docs/internal/Cod1HaulerDeploymentChecklist.js
// 👑 Cod1 Crown Certified — Finalization Checklist for Hauler Module Rollout

const checklist = [
  {
    section: '📍 GeoVerificationMap.js',
    items: [
      '✅ Leaflet map with pickup/dropoff markers',
      '✅ Timestamp and GeoPin validation',
      '✅ Voice memo playback + transcription',
      '✅ Photo preview grid',
      '✅ Flag for dispute button',
      '✅ 3 PDF exports: standard, map snapshot, signable',
      '✅ AI Smart Review summary (status + insights)'
    ]
  },
  {
    section: '🚛 HaulerJobReview.js',
    items: [
      '✅ Job overview layout with delivery fields',
      '✅ AI Smart Review module mirrored from GeoVerificationMap.js',
      '✅ Photo display + GeoPin fallback',
      '✅ Dispute button included'
    ]
  },
  {
    section: '🔐 Backend Routes',
    items: [
      '✅ /export-pdf',
      '✅ /export-pdf-map',
      '✅ /export-signable-pdf',
      '✅ /transcribe-voice',
      '✅ /hash-anchor',
      '✅ /ai-review'
    ]
  },
  {
    section: '🧠 AI Logic + PDF Modules',
    items: [
      '✅ Voice transcription module (Whisper-ready)',
      '✅ Map snapshot embed module (OpenStreetMap static)',
      '✅ Signable PDF module with 3 roles',
      '✅ AI analysis engine for job anomalies',
      '✅ Simulated blockchain anchor (SHA256 + tx hash)'
    ]
  },
  {
    section: '🛠️ Post-Deployment Tasks',
    items: [
      '☑️ Add OPENAI_API_KEY to .env',
      '☑️ Confirm voiceNoteUrl exists per job schema',
      '☑️ Style AI block in admin + buyer dashboards later (optional)',
      '☑️ Add snapshot image logic to PDF in future (Puppeteer optional)'
    ]
  }
];

module.exports = checklist;

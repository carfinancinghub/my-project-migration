// File: InsuranceDeploymentChecklist.js
// Path: docs/internal/InsuranceDeploymentChecklist.js
// @file InsuranceDeploymentChecklist.js
// @path docs/internal/InsuranceDeploymentChecklist.js
// @description Deployment and verification steps for the Insurance role features in CFH platform, supporting May 08, 2025 Rivers Auction test prep — includes AI, risk scoring, claim/policy routes, and test suite coverage for live verification workflows.
// @author Cod2 - May 09, 2025, 16:59 PDT

const insuranceDeploymentChecklist = [
  {
    file: 'InsurancePolicy.js',
    action: 'Deploy insurance policy schema and API logic',
    verify: 'Validate Mongoose schema, indexing, and endpoint contract'
  },
  {
    file: 'InsuranceQuoteAnalyzer.js',
    action: 'Deploy insurance quote analyzer backend logic',
    verify: 'Test quote parsing, risk thresholds, and scoring engine'
  },
  {
    file: 'InsuranceIntegrationTest.js',
    action: 'Run Jest integration tests for AI routes, claims, and policies',
    verify: 'Verify GET /ai/performance, GET /claims/:id/risk, POST /claims, GET /claims/:id, POST /policies, GET /policies/:id, and dataTestId'
  },
  {
    file: 'InsuranceClaimsProcessor.jsx',
    action: 'Deploy claims processing UI with async support',
    verify: 'Check user input, backend interaction, and visual alerts'
  },
  {
    file: 'InsuranceClaimsProcessor.test.jsx',
    action: 'Write and execute unit tests for claim processing UI',
    verify: 'Simulate claim form inputs and check validation responses'
  },
  {
    file: 'InsuranceClaimsAnalytics.jsx',
    action: 'Deploy analytics dashboard with premium visualizations',
    verify: 'Ensure premium gating works, Chart.js renders correctly'
  },
  {
    file: 'InsuranceClaimsAnalytics.test.jsx',
    action: 'Test analytics interactions and chart behavior',
    verify: 'Validate filters, premium lock, and fallback states'
  },
  {
    file: 'InsuranceAIModelPerformance.jsx',
    action: 'Deploy UI for AI model performance metrics',
    verify: 'Verify Chart.js rendering, premium confusion matrix gating, timeframe filtering, and real-time polling logic using setInterval + !document.hidden'
  },
  {
    file: 'InsuranceAIModelPerformance.test.jsx',
    action: 'Test AI performance component with mock data and behavior validation',
    verify: 'Check metric rendering, premium gating, polling interval, filter changes, and ToastManager errors'
  },
  {
    file: 'InsuranceAIController.js',
    action: 'Deploy AI controller for performance metrics and risk scoring',
    verify: 'Verify GET /ai/performance and /api/claims/:id/risk endpoints, Joi validation, premium gating, and test ID metadata'
  },
  {
    file: 'insuranceRoutes.js',
    action: 'Deploy routes for AI performance, risk scoring, claims, and policies',
    verify: 'Verify GET /ai/performance, GET /claims/:id/risk, POST /claims, GET /claims/:id, POST /policies, GET /policies/:id, and Joi validation'
  },
  {
    file: 'Test Prep Showcase',
    action: 'Prepare demo sequence for Insurance features',
    verify: 'Walk through model insights, quote analysis, and claims workflow during May 08, 2025 live test'
  }
];

module.exports = insuranceDeploymentChecklist;

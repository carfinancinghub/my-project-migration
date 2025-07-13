/**
 * File: LenderTermsExporter.js
 * Path: backend/controllers/lender/LenderTermsExporter.js
 * Purpose: Export lender terms to PDF or CSV with analytics and AI recommendations
 * Author: Cod1
 * Date: May 1, 2025
 * 👑 Crown Certified
 */

const analyticsExportUtils = require('@utils/analyticsExportUtils');
const AILenderTermsAnalyzer = require('@utils/AILenderTermsAnalyzer');
const logger = require('@utils/logger');

async function exportLenderTerms(req, res) {
  try {
    const { format, premium } = req.query;
    const lenderData = req.lenderTerms; // assumed pre-fetched or injected
    const filename = `lender_terms_export_${Date.now()}`;

    const aiInsights = premium
      ? AILenderTermsAnalyzer.generateInsights(lenderData)
      : null;

    const file = await analyticsExportUtils.exportToFile({
      data: lenderData,
      format: format || 'pdf',
      metadata: {
        title: 'Lender Terms Export',
        author: 'CFH System',
        ...(aiInsights && { insights: aiInsights }),
      },
      filename,
    });

    return res.download(file);
  } catch (err) {
    logger.error('Lender terms export failed:', err);
    res.status(500).json({ message: 'Failed to export lender terms.' });
  }
}

module.exports = { exportLenderTerms };

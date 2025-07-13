// ***
// File: analyticsExportUtilsGrokOld2.js
// Path: backend/utils/analyticsExportUtilsGrokOld2.js
// Purpose: Generate PDF exports for buyer bid history and AI insights
// Author: Cod2
// Date: 2025-05-01
// 👑 Cod2 Crown Certified
// Functions Provided:
//
//  generateBasicBidHistoryPDF(bidHistory, userId) – Free version export.
//
//  generatePremiumBidAnalyticsPDF(bidHistory, chartImagePath, aiInsights, userId) – Premium version with charts and AI tips.
// ****

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const logger = require('@utils/logger');
const { format } = require('date-fns');

const EXPORT_DIR = path.join(__dirname, '../../exports');
if (!fs.existsSync(EXPORT_DIR)) fs.mkdirSync(EXPORT_DIR);

function formatTimestamp(ts) {
  return format(new Date(ts), 'yyyy-MM-dd HH:mm:ss');
}

function generateBasicBidHistoryPDF(bidHistory, userId) {
  try {
    const doc = new PDFDocument();
    const filename = `bid_history_${userId}_${Date.now()}.pdf`;
    const filePath = path.join(EXPORT_DIR, filename);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(16).text('Bid History Report', { align: 'center' });
    doc.moveDown();
    bidHistory.forEach((bid, i) => {
      doc.fontSize(12).text(`${i + 1}. $${bid.amount} at ${formatTimestamp(bid.timestamp)}`);
    });

    doc.moveDown().fontSize(10).text(`Exported by: ${userId}`);
    doc.text(`Timestamp: ${formatTimestamp(Date.now())}`);
    doc.end();
    return filePath;
  } catch (err) {
    logger.error('Failed to generate basic bid history PDF:', err);
    throw new Error('PDF generation failed');
  }
}

function generatePremiumBidAnalyticsPDF(bidHistory, chartImagePath, aiInsights, userId) {
  try {
    const doc = new PDFDocument({ margin: 50 });
    const filename = `premium_bid_analytics_${userId}_${Date.now()}.pdf`;
    const filePath = path.join(EXPORT_DIR, filename);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(18).text('Premium Bid Analytics Report', { align: 'center' });
    doc.moveDown();

    if (fs.existsSync(chartImagePath)) {
      doc.image(chartImagePath, { fit: [500, 300], align: 'center' });
      doc.moveDown();
    }

    doc.fontSize(14).text(`AI Success Probability: ${Math.round(aiInsights.probability * 100)}%`, { underline: true });
    doc.fontSize(12).text(`Strategy Tip: ${aiInsights.strategyTip}`);
    doc.moveDown();

    doc.fontSize(14).text('Bid History:', { underline: true });
    bidHistory.forEach((bid, i) => {
      doc.fontSize(12).text(`${i + 1}. $${bid.amount} at ${formatTimestamp(bid.timestamp)}`);
    });

    doc.moveDown().fontSize(10).text(`Exported by: ${userId}`);
    doc.text(`Timestamp: ${formatTimestamp(Date.now())}`);
    doc.end();
    return filePath;
  } catch (err) {
    logger.error('Failed to generate premium bid analytics PDF:', err);
    throw new Error('Premium PDF generation failed');
  }
}

module.exports = {
  generateBasicBidHistoryPDF,
  generatePremiumBidAnalyticsPDF,
};

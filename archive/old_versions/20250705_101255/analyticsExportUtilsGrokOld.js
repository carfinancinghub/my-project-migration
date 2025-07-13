// File: analyticsExportUtils.js
// Path: backend/utils/analyticsExportUtils.js
// 👑 Cod1 Crown Certified — Modular Export Engine for Analytics (PDF + CSV)

// 📦 Dependencies
const fs = require('fs');
const { Parser } = require('json2csv');
const pdfExportService = require('@utils/exportUtils/pdfExportService'); // external module handles HTML → PDF conversion
const path = require('path');

/**
 * Exports analytics data as a PDF using pre-rendered HTML template.
 * @param {Object} options - Config object
 * @param {String} options.html - Raw HTML to convert
 * @param {String} options.outputFilePath - Where to save the PDF
 * @returns {Promise<string>} - Full path of the exported file
 */
const exportToPDF = async ({ html, outputFilePath }) => {
  try {
    const pdfPath = await pdfExportService.generatePDF(html, outputFilePath);
    return pdfPath;
  } catch (err) {
    console.error('PDF export failed:', err);
    throw new Error('Unable to generate PDF file');
  }
};

/**
 * Exports analytics data as a CSV file using json2csv.
 * @param {Object[]} data - Array of objects to export
 * @param {String[]} fields - Fields to include in CSV
 * @param {String} fileName - Desired output filename
 * @returns {String} - Full path of generated CSV file
 */
const exportToCSV = (data, fields, fileName) => {
  try {
    const parser = new Parser({ fields });
    const csv = parser.parse(data);
    const outputPath = path.join(__dirname, `../../exports/${fileName}`);
    fs.writeFileSync(outputPath, csv, 'utf8');
    return outputPath;
  } catch (err) {
    console.error('CSV export failed:', err);
    throw new Error('Unable to generate CSV file');
  }
};

/**
 * Dynamically determines export format and executes appropriate logic.
 * @param {'pdf'|'csv'} format - Desired file type
 * @param {Object} payload - Data for export
 * @param {Object[]} payload.data - Analytics data (for CSV)
 * @param {String[]} payload.fields - Field names (for CSV)
 * @param {String} payload.html - HTML string (for PDF)
 * @param {String} payload.fileName - Desired file name
 * @returns {String} - Output file path
 */
const exportAnalytics = async (format, payload) => {
  if (format === 'pdf') {
    return await exportToPDF({
      html: payload.html,
      outputFilePath: path.join(__dirname, `../../exports/${payload.fileName}`),
    });
  } else if (format === 'csv') {
    return exportToCSV(payload.data, payload.fields, payload.fileName);
  } else {
    throw new Error('Unsupported export format');
  }
};

module.exports = {
  exportToPDF,
  exportToCSV,
  exportAnalytics,
};

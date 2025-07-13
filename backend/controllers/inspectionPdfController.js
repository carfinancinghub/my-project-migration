// File: inspectionPdfController.js
// Path: backend/controllers/inspectionPdfController.js

const PDFDocument = require('pdfkit');
const Inspection = require('../models/Inspection');
const fs = require('fs');
const path = require('path');

// Helper to format date
const formatDate = (date) => new Date(date).toLocaleDateString();

exports.generateInspectionPdf = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Inspection.findById(reportId).populate('mechanic assignedTo');
    if (!report) return res.status(404).json({ error: 'Inspection report not found' });

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `../../pdfs/inspection_${reportId}.pdf`);
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    doc.fontSize(20).text('🔍 Vehicle Inspection Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Report ID: ${report._id}`);
    doc.text(`Mechanic: ${report.mechanic?.email || 'N/A'}`);
    doc.text(`Assigned To: ${report.assignedTo?.email || 'N/A'}`);
    doc.text(`Created At: ${formatDate(report.createdAt)}`);
    doc.text(`Completed At: ${formatDate(report.completedAt)}`);
    doc.moveDown();

    doc.text(`🔧 Findings:`);
    doc.text(report.findings || 'No findings provided');
    doc.moveDown();

    if (report.voiceNoteUrl) {
      doc.text(`🎤 Voice Note:`);
      doc.text(report.voiceNoteUrl, { link: report.voiceNoteUrl, underline: true });
      doc.moveDown();
    }

    if (report.photoUrls && report.photoUrls.length > 0) {
      doc.text(`📸 Photos:`);
      report.photoUrls.forEach((url) => {
        doc.text(url, { link: url, underline: true });
      });
    }

    doc.end();

    writeStream.on('finish', () => {
      res.download(filePath, `inspection_${reportId}.pdf`, () => {
        fs.unlinkSync(filePath); // clean up after sending
      });
    });
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};

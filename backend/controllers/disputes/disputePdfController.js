// File: disputePdfController.js
// Path: backend/controllers/disputes/disputePdfController.js

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Dispute = require('@/models/dispute/Dispute');

exports.generateDisputePDF = async (req, res) => {
  try {
    const { disputeId } = req.params;
    const dispute = await Dispute.findById(disputeId).populate('createdBy againstUserId votes.voter');

    if (!dispute) return res.status(404).json({ error: 'Dispute not found' });

    const doc = new PDFDocument();
    const tempPath = path.join(__dirname, `../../../tmp/dispute-${disputeId}.pdf`);
    const stream = fs.createWriteStream(tempPath);
    doc.pipe(stream);

    doc.fontSize(20).text('Dispute Summary Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Dispute ID: ${dispute._id}`);
    doc.text(`Created By: ${dispute.createdBy.username || dispute.createdBy.email}`);
    doc.text(`Against: ${dispute.againstUserId.username || dispute.againstUserId.email}`);
    doc.text(`Reason: ${dispute.reason}`);
    doc.text(`Status: ${dispute.status}`);
    doc.text(`Resolution: ${dispute.resolution || 'Pending'}`);
    doc.moveDown();

    doc.fontSize(14).text('Timeline:', { underline: true });
    dispute.timeline.forEach(entry => {
      doc.fontSize(11).text(`- [${new Date(entry.timestamp).toLocaleString()}] ${entry.event} → ${entry.value || ''}`);
    });

    doc.end();

    stream.on('finish', () => {
      res.download(tempPath, `Dispute-${disputeId}.pdf`, () => {
        fs.unlink(tempPath, () => {}); // clean up
      });
    });
  } catch (err) {
    console.error('Dispute PDF generation error:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};

// File: exportDeliveryPDF.js
// Path: backend/controllers/hauler/exportDeliveryPDF.js
// 👑 Cod1 Crown Certified — PDF Delivery Report Generator for Haulers, Admins, Arbitrators

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Job = require('../../models/Job');

const exportDeliveryPDF = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).populate('hauler car');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const doc = new PDFDocument();
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=DeliveryReport_${jobId}.pdf`);
      res.send(pdfBuffer);
    });

    // 📝 HEADER
    doc.fontSize(20).text('📦 Delivery Report', { align: 'center' });
    doc.moveDown();

    // 📄 BASIC INFO
    doc.fontSize(12).text(`Job ID: ${job._id}`);
    doc.text(`Hauler: ${job.hauler?.name || 'N/A'}`);
    doc.text(`Car: ${job.car?.make} ${job.car?.model} (${job.car?.year})`);
    doc.text(`Status: ${job.status}`);
    doc.text(`GeoPin: ${job.geoPin || 'Not available'}`);
    doc.text(`Updated At: ${new Date(job.updatedAt).toLocaleString()}`);
    doc.moveDown();

    // 📍 GEO MAP (placeholder for future snapshot image integration)
    doc.fontSize(14).text('Geo Verification Map:', { underline: true });
    doc.text('View map inside dashboard or generate snapshot on frontend.');
    doc.moveDown();

    // 🖼️ PHOTOS (external links)
    if (job.photos && job.photos.length > 0) {
      doc.fontSize(14).text('Uploaded Photos:', { underline: true });
      job.photos.forEach((photoUrl, index) => {
        doc.text(`Proof ${index + 1}: ${photoUrl}`);
      });
      doc.moveDown();
    } else {
      doc.text('No photos uploaded.');
    }

    // 🎙️ VOICE NOTE (if applicable)
    if (job.voiceNoteUrl) {
      doc.fontSize(14).text('Voice Note:', { underline: true });
      doc.text(`Listen: ${job.voiceNoteUrl}`);
      doc.moveDown();
    }

    // 📑 SIGNATURE PLACEHOLDER
    doc.text('Signature: _______________________________', { align: 'left' });
    doc.text(`Signed on: __________________________`, { align: 'left' });

    doc.end();
  } catch (err) {
    console.error('PDF Export Error:', err);
    res.status(500).json({ message: 'Failed to generate PDF.' });
  }
};

module.exports = exportDeliveryPDF;

// File: generateSignablePDF.js
// Path: backend/controllers/hauler/generateSignablePDF.js
// 👑 Cod1 Crown Certified — PDF Generator with Signature-Ready Fields

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Job = require('../../models/Job');

const generateSignablePDF = async (req, res) => {
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
      res.setHeader('Content-Disposition', `attachment; filename=SignableReport_${jobId}.pdf`);
      res.send(pdfBuffer);
    });

    doc.fontSize(20).text('📦 Delivery Agreement Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Job ID: ${job._id}`);
    doc.text(`Hauler: ${job.hauler?.name || 'N/A'}`);
    doc.text(`Car: ${job.car?.make} ${job.car?.model} (${job.car?.year})`);
    doc.text(`Delivery Status: ${job.status}`);
    doc.text(`GeoPin: ${job.geoPin || 'N/A'}`);
    doc.text(`Timestamp: ${new Date(job.updatedAt).toLocaleString()}`);
    doc.moveDown();

    doc.fontSize(14).text('Signatures Required:', { underline: true });
    doc.moveDown();

    doc.text('Hauler Signature: _________________________');
    doc.text('Date: _________________________');
    doc.moveDown();

    doc.text('Buyer Signature: _________________________');
    doc.text('Date: _________________________');
    doc.moveDown();

    doc.text('Escrow Officer Signature: _________________________');
    doc.text('Date: _________________________');

    doc.end();
  } catch (err) {
    console.error('Signable PDF Error:', err);
    res.status(500).json({ message: 'Failed to generate signable delivery report.' });
  }
};

module.exports = generateSignablePDF;

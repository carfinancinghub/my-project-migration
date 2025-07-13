// File: embedMapSnapshotPDF.js
// Path: backend/controllers/hauler/embedMapSnapshotPDF.js
// 👑 Cod1 Crown Certified — PDF Map Snapshot Embedder for Hauler Delivery Report

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Job = require('../../models/Job');

const embedMapSnapshotPDF = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).populate('hauler car');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const geoPin = job.geoPin;
    const [lat, lng] = geoPin ? geoPin.split(',') : ['37.7749', '-122.4194'];

    // Fetch snapshot image using a map image service
    const mapImageUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=13&size=600x300&markers=${lat},${lng},red-pushpin`;
    const mapImageBuffer = (await axios.get(mapImageUrl, { responseType: 'arraybuffer' })).data;

    const doc = new PDFDocument();
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=DeliveryReport_${jobId}.pdf`);
      res.send(pdfBuffer);
    });

    // 🧾 Delivery Info Header
    doc.fontSize(20).text('📦 Delivery Report with Map Snapshot', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Job ID: ${job._id}`);
    doc.text(`Hauler: ${job.hauler?.name || 'N/A'}`);
    doc.text(`Car: ${job.car?.make} ${job.car?.model} (${job.car?.year})`);
    doc.text(`GeoPin: ${geoPin || 'N/A'}`);
    doc.text(`Timestamp: ${new Date(job.updatedAt).toLocaleString()}`);
    doc.moveDown();

    // 🗺️ Embed Static Map Image
    doc.fontSize(14).text('Delivery Map Snapshot:', { underline: true });
    const imgPath = path.join(__dirname, `map_snapshot_${jobId}.png`);
    fs.writeFileSync(imgPath, mapImageBuffer);
    doc.image(imgPath, { fit: [500, 300] });
    fs.unlinkSync(imgPath);
    doc.moveDown();

    // 🔒 Signature Placeholder
    doc.text('Signature: _________________________');
    doc.text(`Signed on: _________________________`);

    doc.end();
  } catch (err) {
    console.error('Map Snapshot PDF Error:', err);
    res.status(500).json({ message: 'Failed to generate map snapshot PDF.' });
  }
};

module.exports = embedMapSnapshotPDF;

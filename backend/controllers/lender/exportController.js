// File: exportController.js
// Path: backend/controllers/lender/exportController.js

const Loan = require('@/models/loan/Loan');  // ✅ Corrected!
const Bid = require('@/models/Bid');
const LenderReputation = require('@/models/lender/LenderReputation');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

// Helper to generate CSV
const generateCSV = (data, fields) => {
  const parser = new Parser({ fields });
  return parser.parse(data);
};

// Helper to generate PDF buffer
const generatePDF = (title, data) => {
  const doc = new PDFDocument();
  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {}); // Needed to collect the stream properly

  doc.fontSize(18).text(title, { underline: true });
  doc.moveDown();

  data.forEach((item, i) => {
    doc.fontSize(12).text(`${i + 1}. ${JSON.stringify(item)}`);
    doc.moveDown();
  });

  doc.end();
  return new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(buffers)));
  });
};

/**
 * @desc    Export lender-related data as CSV or PDF
 * @route   GET /api/lender/export/:type
 * @query   format=csv|pdf (default csv), from=YYYY-MM-DD, to=YYYY-MM-DD
 * @access  Private
 */
exports.exportData = async (req, res) => {
  const { type } = req.params;
  const { format = 'csv', from, to } = req.query;
  const query = {};
  if (from && to) {
    query.createdAt = { $gte: new Date(from), $lte: new Date(to) };
  }

  try {
    let data = [];
    let fields = [];

    switch (type) {
      case 'loan-bids':
        data = await Bid.find(query).populate('lender', 'email');
        fields = ['_id', 'amount', 'status', 'lender.email'];
        break;
      case 'approved-loans':
        data = await Loan.find({ ...query, status: 'approved' });
        fields = ['_id', 'amount', 'borrower', 'status'];
        break;
      case 'reputation':
        data = await LenderReputation.find(query).populate('lender', 'email');
        fields = ['lender.email', 'rating', 'reviews.length', 'disputes.length'];
        break;
      default:
        return res.status(400).json({ message: 'Invalid export type' });
    }

    if (format === 'pdf') {
      const buffer = await generatePDF(`${type} Export`, data);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${type}.pdf"`);
      return res.end(buffer);
    } else {
      const csv = generateCSV(data, fields);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${type}.csv"`);
      return res.send(csv);
    }
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ message: 'Export failed' });
  }
};

// File: pdfGenerator.js
// Path: backend/controllers/pdfGenerator.js

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateLoanAgreementPDF = (data, res) => {
  try {
    const {
      buyerName,
      lenderName,
      vehicleDetails,
      loanAmount,
      downPayment,
      interestRate,
      termMonths,
      auctionId,
    } = data;

    const doc = new PDFDocument();
    const tempFilePath = path.join(__dirname, `../../tmp/contract-${auctionId}.pdf`);
    const stream = fs.createWriteStream(tempFilePath);
    doc.pipe(stream);

    doc.fontSize(20).text('Car Financing Loan Agreement', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Buyer: ${buyerName}`);
    doc.text(`Lender: ${lenderName}`);
    doc.text(`Vehicle: ${vehicleDetails}`);
    doc.text(`Loan Amount: $${loanAmount}`);
    doc.text(`Down Payment: $${downPayment}`);
    doc.text(`Interest Rate: ${interestRate}%`);
    doc.text(`Term: ${termMonths} months`);
    doc.moveDown();

    // Add placeholders for e-signature platforms (like DocuSign/HelloSign)
    doc.text('_________________________', { continued: true }).text('   ', { continued: true }).text('_________________________');
    doc.text('Buyer Signature                     Lender Signature');

    doc.end();

    stream.on('finish', () => {
      res.download(tempFilePath, `Loan-Agreement-${auctionId}.pdf`, () => {
        fs.unlink(tempFilePath, () => {}); // Clean up temp file
      });
    });
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};

module.exports = {
  generateLoanAgreementPDF,
};
1111
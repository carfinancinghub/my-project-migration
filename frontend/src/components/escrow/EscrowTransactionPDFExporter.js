// File: EscrowTransactionPDFExporter.js
// Path: frontend/src/components/escrow/EscrowTransactionPDFExporter.js
// Author: Cod2 Crown Certified (05072043)
// Description: Exports escrow transaction details to a PDF with branding, watermark, and premium layout

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '@/assets/pdf/logo_watermark.png'; // Optional watermark logo (Base64 or URL)

/**
 * Generates a formatted PDF summary of the given escrow transaction.
 * @param {Object} transaction - The escrow transaction object.
 * @returns {void}
 */
const exportEscrowTransactionToPDF = (transaction) => {
  if (!transaction) return;

  const doc = new jsPDF();

  // Branding & Header
  doc.setFontSize(18);
  doc.text('Escrow Transaction Summary', 14, 22);

  // Watermark (Optional)
  doc.addImage(logo, 'PNG', 60, 90, 90, 90, '', 'NONE');
  doc.setTextColor(40, 40, 40);

  // Metadata table
  autoTable(doc, {
    startY: 30,
    head: [['Field', 'Value']],
    body: [
      ['Transaction ID', transaction._id || 'N/A'],
      ['Status', transaction.status || 'Unknown'],
      ['Amount', `$${transaction.amount?.toLocaleString()}` || '0.00'],
      ['Buyer', transaction.buyer?.email || 'Unknown'],
      ['Seller', transaction.seller?.email || 'Unknown'],
      ['Created At', new Date(transaction.createdAt).toLocaleString()],
      ['Last Updated', new Date(transaction.updatedAt).toLocaleString()],
    ],
  });

  // Conditions table
  if (transaction.conditions?.length > 0) {
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Conditions Checklist', 'Met']],
      body: transaction.conditions.map((c) => [c.description, c.met ? '✅ Yes' : '❌ No']),
    });
  }

  // Audit Log (Optional)
  if (transaction.auditLog?.length > 0) {
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Timestamp', 'Action', 'User']],
      body: transaction.auditLog.map((log) => [
        new Date(log.timestamp).toLocaleString(),
        log.action,
        log.user?.email || `User ID ${log.user}`,
      ]),
    });
  }

  // Save PDF
  const fileName = `Escrow_Transaction_${transaction._id || 'Unknown'}.pdf`;
  doc.save(fileName);
};

export default exportEscrowTransactionToPDF;

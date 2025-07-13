// File: signatureInit.js
// Path: backend/controllers/signatureInit.js

const prepareESignatureMetadata = async (req, res) => {
  try {
    const { auctionId, buyer, lender } = req.body;

    const metadata = {
      auctionId,
      signers: [
        {
          role: 'Buyer',
          name: buyer.name,
          email: buyer.email,
          anchor: 'Buyer Signature',
          anchorYOffset: '10',
        },
        {
          role: 'Lender',
          name: lender.name,
          email: lender.email,
          anchor: 'Lender Signature',
          anchorYOffset: '10',
        },
      ],
      fileName: `Loan-Agreement-${auctionId}.pdf`,
    };

    res.status(200).json({ success: true, metadata });
  } catch (err) {
    console.error('eSignature metadata error:', err);
    res.status(500).json({ success: false, error: 'Failed to prepare metadata' });
  }
};

module.exports = {
  prepareESignatureMetadata,
};

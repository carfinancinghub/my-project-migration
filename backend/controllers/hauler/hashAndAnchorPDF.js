// File: hashAndAnchorPDF.js
// Path: backend/controllers/hauler/hashAndAnchorPDF.js
// 👑 Cod1 Crown Certified — PDF Hash Generator + Optional Blockchain Anchor

const crypto = require('crypto');
const axios = require('axios');
const Job = require('../../models/Job');

const hashAndAnchorPDF = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Simulate PDF content as buffer (in real app, use actual PDF buffer)
    const simulatedPDFBuffer = Buffer.from(JSON.stringify({
      jobId: job._id,
      geoPin: job.geoPin,
      updatedAt: job.updatedAt,
      status: job.status,
    }));

    const hash = crypto.createHash('sha256').update(simulatedPDFBuffer).digest('hex');

    // Optional blockchain anchoring placeholder (e.g., Ethereum, IPFS)
    const fakeTxHash = `0x${hash.substring(0, 64)}`;
    const anchorLink = `https://etherscan.io/tx/${fakeTxHash}`;

    // Store hash reference in job (optional real DB write)
    // job.hashAnchor = hash;
    // job.anchorTx = fakeTxHash;
    // await job.save();

    res.json({
      message: 'Document hash generated successfully.',
      sha256: hash,
      txHash: fakeTxHash,
      anchorLink,
    });
  } catch (err) {
    console.error('Hash generation failed:', err);
    res.status(500).json({ message: 'Failed to hash and anchor document.' });
  }
};

module.exports = hashAndAnchorPDF;

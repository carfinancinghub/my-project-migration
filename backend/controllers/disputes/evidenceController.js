// File: evidenceController.js
// Path: backend/controllers/disputes/evidenceController.js

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Dispute = require('@/models/dispute/Dispute');
const { triggerDisputeNotification } = require('../../utils/notificationTrigger');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, `../../../uploads/evidence/${req.params.disputeId}`);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${timestamp}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/', 'video/', 'audio/', 'application/pdf'];
    if (allowed.some(type => file.mimetype.startsWith(type))) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  },
});

exports.uploadEvidenceMiddleware = upload.single('evidence');

exports.saveEvidenceToDispute = async (req, res) => {
  try {
    const { disputeId } = req.params;
    const dispute = await Dispute.findById(disputeId);
    if (!dispute) return res.status(404).json({ error: 'Dispute not found' });

    dispute.evidence = dispute.evidence || [];
    dispute.evidence.push({
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      uploadedAt: new Date(),
    });

    dispute.timeline.push({
      event: 'Evidence Uploaded',
      value: req.file.filename,
      timestamp: new Date(),
    });

    await dispute.save();

    // Notify involved parties
    await triggerDisputeNotification({
      type: 'Evidence Uploaded',
      disputeId,
      recipientId: [dispute.createdBy, dispute.againstUserId],
      message: `📤 New evidence uploaded for dispute ${disputeId}`,
      suppressDuplicates: true,
    });

    res.status(200).json({ message: 'Evidence uploaded', file: req.file });
  } catch (err) {
    console.error('Error saving evidence:', err);
    res.status(500).json({ error: 'Failed to upload evidence' });
  }
};

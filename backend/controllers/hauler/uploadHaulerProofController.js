// File: uploadHaulerProofController.js
// Path: backend/controllers/hauler/uploadHaulerProofController.js
// 👑 Cod1 Crown Certified — Handles Proof-of-Delivery Uploads for Haulers

const HaulerJob = require('../../../models/HaulerJob');
const cloudinary = require('../../../utils/cloudinary'); // Optional if using Cloudinary

exports.uploadHaulerProof = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { voiceNote } = req.body;
    const photoUrls = [];

    // Upload each photo to Cloudinary or local storage
    if (req.files && req.files.photos) {
      for (const file of req.files.photos) {
        const result = await cloudinary.uploader.upload(file.path);
        photoUrls.push(result.secure_url);
      }
    }

    const job = await HaulerJob.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Hauler job not found' });

    // Update job with proof
    job.proof = {
      photos: [...(job.proof?.photos || []), ...photoUrls],
      voiceNote: voiceNote || job.proof?.voiceNote,
      updatedAt: Date.now(),
    };

    await job.save();
    res.status(200).json({ message: 'Proof uploaded successfully', proof: job.proof });
  } catch (err) {
    console.error('Proof upload error:', err);
    res.status(500).json({ message: 'Server error during proof upload' });
  }
};

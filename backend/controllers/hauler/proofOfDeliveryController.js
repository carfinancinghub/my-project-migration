// File: proofOfDeliveryController.js
// Path: backend/controllers/hauler/proofOfDeliveryController.js
// 👑 Cod1 Crown Certified — Multi-Proof Geo/Photo Delivery Engine

const HaulerJob = require('../../models/HaulerJob');
const asyncHandler = require('express-async-handler');

// Submit GeoPin and Photo Proof of Delivery
exports.submitProofOfDelivery = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId;
  const { geoPin, notes, photoUrls = [] } = req.body;

  const job = await HaulerJob.findById(jobId);
  if (!job) return res.status(404).json({ message: 'Delivery job not found' });

  job.geoPin = geoPin || job.geoPin;
  job.notes = notes || job.notes;
  job.photos = photoUrls.length > 0 ? photoUrls : job.photos;
  job.status = 'Delivered';
  job.deliveredAt = new Date();

  await job.save();
  res.json({ message: '📍 Delivery marked complete', job });
});

// Optional: Retrieve Delivery Proof for Display
exports.getProofOfDelivery = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId;
  const job = await HaulerJob.findById(jobId).select('geoPin notes photos deliveredAt');
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json(job);
});

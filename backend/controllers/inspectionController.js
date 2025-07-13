// File: inspectionController.js
// Path: backend/controllers/inspectionController.js

const Inspection = require('../models/Inspection');
const User = require('../models/User');

// 👁️ GET a single inspection report by ID
exports.getInspectionReportById = async (req, res) => {
  try {
    const report = await Inspection.findById(req.params.reportId).populate('mechanic vehicle buyer');
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) {
    console.error('Error fetching inspection report:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 🧑‍🔧 GET all inspection jobs assigned to this mechanic
exports.getMyInspectionJobs = async (req, res) => {
  try {
    const jobs = await Inspection.find({ mechanic: req.user._id }).populate('vehicle');
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching mechanic jobs:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 🛠️ CREATE a new inspection job
exports.createInspectionJob = async (req, res) => {
  try {
    const { vehicle, scheduledDate, assignedTo } = req.body;
    const newJob = new Inspection({
      vehicle,
      scheduledDate,
      mechanic: assignedTo || req.user._id,
    });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) {
    console.error('Error creating inspection job:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 📝 SUBMIT an inspection report
exports.submitInspectionReport = async (req, res) => {
  try {
    const { condition, notes, issuesFound, photoUrls, voiceNotes } = req.body;
    const job = await Inspection.findById(req.params.jobId);
    if (!job) return res.status(404).json({ error: 'Inspection job not found' });

    job.condition = condition;
    job.notes = notes;
    job.issuesFound = issuesFound;
    job.photoUrls = photoUrls || [];
    job.voiceNotes = voiceNotes || [];
    job.completedAt = new Date();
    job.status = 'Completed';

    await job.save();
    res.json({ message: 'Inspection report submitted successfully' });
  } catch (err) {
    console.error('Error submitting inspection report:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 📋 GET all reports for admin view
exports.getAllInspectionReports = async (req, res) => {
  try {
    const reports = await Inspection.find().populate('vehicle mechanic buyer');
    res.json(reports);
  } catch (err) {
    console.error('Error fetching inspection reports:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

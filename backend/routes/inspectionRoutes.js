// File: inspectionRoutes.js
// Path: backend/routes/inspectionRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  getInspectionReportById,
  getMyInspectionJobs,
  createInspectionJob,
  submitInspectionReport,
  getAllInspectionReports
} = require('../controllers/inspectionController'); // 👑 Renamed to match purpose

const {
  generateInspectionPdf
} = require('../controllers/inspectionPdfController'); // 👑 New crown controller for PDF output

// 🔒 Authenticated routes only
router.use(authMiddleware);

// 🧪 GET /api/inspection/reports/:reportId - View a specific inspection report
router.get('/reports/:reportId', getInspectionReportById);

// 🧑‍🔧 GET /api/inspection/my-jobs - Mechanic gets their assigned inspection jobs
router.get('/my-jobs', roleMiddleware('mechanic'), getMyInspectionJobs);

// 🛠️ POST /api/inspection/create - Create a new inspection job (admin or mechanic)
router.post('/create', roleMiddleware(['admin', 'mechanic']), createInspectionJob);

// 📝 PUT /api/inspection/submit/:jobId - Submit inspection findings
router.put('/submit/:jobId', roleMiddleware('mechanic'), submitInspectionReport);

// 📋 GET /api/inspection/all - Admin view of all reports (optional future use — consider pagination)
router.get('/all', roleMiddleware('admin'), getAllInspectionReports);

// 📄 GET /api/inspection/pdf/:reportId - Generate downloadable PDF report for a specific inspection
router.get('/pdf/:reportId', generateInspectionPdf);

module.exports = router;

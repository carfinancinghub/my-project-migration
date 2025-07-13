// Date: 062625 [1000], © 2025 CFH
import express from 'express';
const router = express.Router();
router.get('/arbitrator-performance', (req, res) => res.status(200).json({ message: 'Arbitrator performance stub' }));
export default router;

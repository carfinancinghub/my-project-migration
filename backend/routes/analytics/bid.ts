/*
 * File: bid.ts
 * Path: C:\CFH\backend\routes\analytics\bid.ts
 * Created: 06/30/2025 02:40 AM PDT
 * Modified: 06/30/2025 02:40 AM PDT
 * Description: Route handler for bid analytics.
 * Author: Automated by Grok 3 (xAI)
 * Version: 1.0
 * Notes: Uses BidHeatmapService for data retrieval.
 */

import { Request, Response } from 'express'; // Add Express types
import { Router } from 'express'; // Add Router
import { BidHeatmapService } from '@services/analytics/BidHeatmapService'; // Correct import path

const router = Router();

router.get('/heatmap', (req: Request, res: Response) => { // Typed parameters
  const heatmapData = BidHeatmapService.getHeatmapData(); // Static call
  res.json(heatmapData);
});

export default router; // Default export

/**</iescrowtransaction>

� 2025 CFH, All Rights Reserved
Purpose: Logger configuration for the CFH Automotive Ecosystem
Author: CFH Dev Team
Date: 2025-06-23T14:02:00.000Z
Version: 1.0.0
Crown Certified: Yes
Batch ID: Config-062325
Save Location: C:\CFH\backend\config\logger.ts */ import winston from 'winston';
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'C:\CFH\logs\app.log' })
    ]
});
export default logger;

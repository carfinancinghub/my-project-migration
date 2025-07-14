import { createLogger, transports, format, Logger } from 'winston';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// Ensure logs directory exists
if (!fs.existsSync('logs')) fs.mkdirSync('logs');

const logger: Logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.label({ label: 'CFH-Backend' }),
    format.timestamp(),
    format((info) => {
      const correlationId = info?.meta?.correlationId || info.correlationId || uuidv4();
      info.correlationId = correlationId;
      return info;
    })(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/app.log', level: 'error' }),
  ],
  silent: process.env.NODE_ENV === 'test',
});

export default logger;

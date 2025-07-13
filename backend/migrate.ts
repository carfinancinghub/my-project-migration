import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import logger from '@config/logger';

async function migrate(): Promise<void> {
  const migrationDir = path.join(__dirname, 'migrations');
  const files = await fs.readdir(migrationDir);
  for (const file of files) {
    if (file.endsWith('.js')) {
      const migration = require(path.join(migrationDir, file));
      await migration.up();
      logger.info(`Applied migration: ${file}`);
    }
  }
}

migrate().catch(err => logger.error(`Migration error: ${err.message}`));

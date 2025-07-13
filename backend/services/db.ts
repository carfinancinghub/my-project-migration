import mongoose from 'mongoose';
import logger from '@config/logger';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect('mongodb://localhost:27017/cfh', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as mongoose.ConnectOptions);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error(`DB connection error: ${(error as Error).message}`);
    throw error;
  }
};

export const db = mongoose;
export default connectDB;

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    
    if (!process.env.MONGODB_URL) {
        throw new Error('MONGODB_URL is not defined');
      }

    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');
 
} catch (err) {
    console.error('Could not connect to MongoDB:', err);
    process.exit(1); 
  }
};

export default connectDB;

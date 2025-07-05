import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.set('debug', true);

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB Connected!');
  process.exit(0);
} catch (err) {
  console.error('❌ Connection Failed:', err.message);
  process.exit(1);
}
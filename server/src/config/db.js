import mongoose from 'mongoose';

export async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI is missing. API will start, but database routes will return an error until configured.');
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
}

import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const result = await mongoose.connection.collection('applications').updateMany(
  { 'resume.url': 'not_provided' },
  { $set: { 'resume.url': '', 'resume.public_id': '' } }
);

console.log(`✅ Fixed ${result.modifiedCount} applications with invalid resume URLs`);
await mongoose.disconnect();
process.exit(0);

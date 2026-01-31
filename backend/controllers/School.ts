import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true }, // References Country Name
}, { timestamps: true });

export default mongoose.model('School', schoolSchema);
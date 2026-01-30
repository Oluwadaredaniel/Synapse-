import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true }, // ISO code like NG, US
  flag: { type: String, required: true } // Emoji like 🇳🇬
}, { timestamps: true });

export default mongoose.model('Country', countrySchema);
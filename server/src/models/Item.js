import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  type: { type: String, required: true, enum: ['lost', 'found'] },
  category: { type: String, required: true, enum: ['Electronics', 'Accessories', 'ID cards', 'Books', 'Keys', 'Other'] },
  location: { type: String, required: true, trim: true, maxlength: 150 },
  date: { type: Date, required: true },
  description: { type: String, trim: true, maxlength: 1000, default: '' },
  contact: { type: String, trim: true, maxlength: 150, default: '' },
  status: { type: String, enum: ['open', 'returned'], default: 'open' }
}, { timestamps: true });

itemSchema.index({ title: 'text', description: 'text', location: 'text' });
export default mongoose.model('Item', itemSchema);

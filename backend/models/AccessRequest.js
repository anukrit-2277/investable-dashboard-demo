import mongoose from 'mongoose';

const AccessRequestSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  companyName: { type: String, required: true },
  investorEmail: { type: String, required: true },
  investorName: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('AccessRequest', AccessRequestSchema);

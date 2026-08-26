import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  type: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  transactionId: { type: String, required: true },
  customerId: { type: String, required: true },
  status: { type: String, enum: ['active', 'investigating', 'resolved', 'escalated'], default: 'active' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: { type: Date },
}, { timestamps: true });

export const Alert = mongoose.model('Alert', alertSchema);

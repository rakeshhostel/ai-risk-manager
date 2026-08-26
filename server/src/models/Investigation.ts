import mongoose from 'mongoose';

const investigationSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  analystId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{
    role: { type: String, enum: ['user', 'ai', 'system'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  findings: { type: String },
}, { timestamps: true });

export const Investigation = mongoose.model('Investigation', investigationSchema);

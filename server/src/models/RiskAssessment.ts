import mongoose from 'mongoose';

const riskAssessmentSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  riskScore: { type: Number, required: true },
  riskLevel: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  decision: { type: String, enum: ['approve', 'monitor', 'review', 'block'], required: true },
  factors: [{
    name: { type: String, required: true },
    score: { type: Number, required: true },
    description: { type: String, required: true }
  }],
  aiExplanation: { type: String },
  aiConfidence: { type: Number },
  analyzedAt: { type: Date, default: Date.now },
});

export const RiskAssessment = mongoose.model('RiskAssessment', riskAssessmentSchema);

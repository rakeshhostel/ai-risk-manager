import mongoose from 'mongoose';

const riskRuleSchema = new mongoose.Schema({
  ruleId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  weight: { type: Number, required: true },
  threshold: { type: Number },
  category: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

export const RiskRule = mongoose.model('RiskRule', riskRuleSchema);

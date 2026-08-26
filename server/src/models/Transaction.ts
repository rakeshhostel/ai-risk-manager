import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'], required: true },
  merchantId: { type: String, required: true },
  merchantName: { type: String, required: true },
  deviceId: { type: String, required: true },
  deviceType: { type: String, required: true },
  location: {
    city: { type: String, required: true },
    country: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  ipAddress: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'blocked', 'under_review'], default: 'completed' },
  previousTransactionCount: { type: Number, default: 0 },
  previousFailedAttempts: { type: Number, default: 0 },
  accountAge: { type: Number, default: 0 }, // in days
  historicalAvgAmount: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

export const Transaction = mongoose.model('Transaction', transactionSchema);

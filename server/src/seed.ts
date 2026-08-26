import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { config } from './config';
import { User } from './models/User';
import { Transaction } from './models/Transaction';
import { RiskAssessment } from './models/RiskAssessment';
import { Alert } from './models/Alert';
import { RiskRule } from './models/RiskRule';
import { AuditLog } from './models/AuditLog';
import { riskEngine } from './services/riskEngine';
import { aiService } from './services/aiService';

const NAMES = [
  'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Neha Gupta', 'Vikram Singh',
  'Anjali Desai', 'Suresh Rao', 'Kavita Reddy', 'Deepak Joshi', 'Meera Nair',
  'Arjun Mehta', 'Pooja Verma', 'Rohan Kapoor', 'Sneha Iyer', 'Karan Malhotra',
  'Ritu Agarwal', 'Sanjay Pandey', 'Divya Choudhary', 'Manish Tiwari', 'Swati Saxena'
];

const CITIES = [
  { city: 'Mumbai', lat: 19.076, lng: 72.877 },
  { city: 'Delhi', lat: 28.613, lng: 77.209 },
  { city: 'Bangalore', lat: 12.971, lng: 77.594 },
  { city: 'Chennai', lat: 13.082, lng: 80.270 },
  { city: 'Hyderabad', lat: 17.385, lng: 78.486 },
  { city: 'Pune', lat: 18.520, lng: 73.856 },
  { city: 'Kolkata', lat: 22.572, lng: 88.363 },
  { city: 'Ahmedabad', lat: 23.022, lng: 72.571 },
  { city: 'Jaipur', lat: 26.912, lng: 75.787 },
  { city: 'Lucknow', lat: 26.846, lng: 80.946 },
];

const MERCHANTS = [
  'Amazon India', 'Flipkart', 'Swiggy', 'Zomato', 'BigBasket',
  'Myntra', 'CRED', 'PhonePe Store', 'Paytm Mall', 'Reliance Digital',
  'DMart', 'BookMyShow', 'MakeMyTrip', 'Uber India', 'Ola Cabs'
];

const PAYMENT_METHODS: Array<'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Wallet'> = [
  'UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'
];
const DEVICE_TYPES = ['Mobile', 'Desktop', 'Tablet'];

const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

async function seed() {
  await mongoose.connect(config.mongoUri);
  console.log('Connected to MongoDB for seeding...');

  // Clear existing data
  await User.deleteMany({});
  await Transaction.deleteMany({});
  await RiskAssessment.deleteMany({});
  await Alert.deleteMany({});
  await RiskRule.deleteMany({});
  await AuditLog.deleteMany({});
  console.log('Cleared existing data.');

  // 1. Create demo user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = new User({
    email: 'admin@demo.com',
    password: hashedPassword,
    name: 'Admin User',
    role: 'admin'
  });
  await adminUser.save();
  console.log('Created demo user: admin@demo.com / admin123');

  // 2. Create default risk rules
  const rules = [
    { ruleId: 'R-001', name: 'Amount Anomaly', description: 'Flags transactions where amount exceeds historical average', enabled: true, weight: 30, threshold: 5, category: 'Amount', lastUpdated: new Date() },
    { ruleId: 'R-002', name: 'New Device', description: 'Flags transactions from unrecognized devices', enabled: true, weight: 15, threshold: 1, category: 'Device', lastUpdated: new Date() },
    { ruleId: 'R-003', name: 'Location Anomaly', description: 'Flags transactions from unknown or unusual locations', enabled: true, weight: 15, threshold: 1, category: 'Location', lastUpdated: new Date() },
    { ruleId: 'R-004', name: 'High Velocity', description: 'Flags accounts with excessive transaction frequency', enabled: true, weight: 20, threshold: 10, category: 'Velocity', lastUpdated: new Date() },
    { ruleId: 'R-005', name: 'Failed Attempts', description: 'Flags accounts with multiple failed transaction attempts', enabled: true, weight: 15, threshold: 3, category: 'Security', lastUpdated: new Date() },
    { ruleId: 'R-006', name: 'New Account', description: 'Flags transactions from newly created accounts', enabled: true, weight: 10, threshold: 7, category: 'Account', lastUpdated: new Date() },
    { ruleId: 'R-007', name: 'Behavior Change', description: 'Flags significant deviations from historical behavior', enabled: true, weight: 10, threshold: 1, category: 'Behavior', lastUpdated: new Date() },
    { ruleId: 'R-008', name: 'Device Reputation', description: 'Flags devices linked to previous fraud', enabled: true, weight: 15, threshold: 1, category: 'Device', lastUpdated: new Date() },
  ];
  await RiskRule.insertMany(rules);
  console.log('Created 8 default risk rules.');

  // 3. Generate 250 synthetic transactions
  const transactions = [];
  const customerIds: string[] = [];
  for (let i = 0; i < 30; i++) {
    customerIds.push(`CUST_${randomInt(1000, 9999)}`);
  }

  for (let i = 0; i < 250; i++) {
    const isAnomaly = Math.random() < 0.25; // 25% anomalous
    const anomalyType = isAnomaly ? randomInt(1, 6) : 0;

    const customerId = randomItem(customerIds);
    const customerName = randomItem(NAMES);
    const cityData = anomalyType === 3
      ? { city: 'Unknown', lat: 0, lng: 0 }
      : randomItem(CITIES);
    
    const baseAmount = randomInt(100, 15000);
    const historicalAvg = baseAmount;

    let amount = baseAmount;
    let deviceId = `DEV_${uuidv4().substring(0, 8)}`;
    let prevTxn = randomInt(0, 4);
    let failedAttempts = 0;
    let accountAge = randomInt(60, 1200);

    if (anomalyType === 1) {
      // High amount anomaly
      amount = randomInt(50000, 500000);
    } else if (anomalyType === 2) {
      // New device
      deviceId = `NEW_${uuidv4().substring(0, 8)}`;
    } else if (anomalyType === 4) {
      // High velocity
      prevTxn = randomInt(8, 25);
      failedAttempts = randomInt(2, 8);
    } else if (anomalyType === 5) {
      // New account
      accountAge = randomInt(1, 6);
    } else if (anomalyType === 6) {
      // Multiple failed + high amount
      amount = randomInt(80000, 300000);
      failedAttempts = randomInt(4, 10);
      deviceId = `NEW_${uuidv4().substring(0, 8)}`;
    }

    const merchant = randomItem(MERCHANTS);
    const txnId = `TXN_${String(100000 + i).slice(-6)}${randomInt(10, 99)}`;

    const t = new Transaction({
      transactionId: txnId,
      customerId,
      customerName,
      amount,
      paymentMethod: randomItem(PAYMENT_METHODS),
      merchantId: `MER_${randomInt(100, 999)}`,
      merchantName: merchant,
      deviceId,
      deviceType: randomItem(DEVICE_TYPES),
      location: { city: cityData.city, country: 'India', lat: cityData.lat + (Math.random() - 0.5) * 2, lng: cityData.lng + (Math.random() - 0.5) * 2 },
      ipAddress: `${randomInt(1, 255)}.${randomInt(1, 255)}.${randomInt(1, 255)}.${randomInt(1, 255)}`,
      previousTransactionCount: prevTxn,
      previousFailedAttempts: failedAttempts,
      accountAge,
      historicalAvgAmount: historicalAvg,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    });

    // Run risk engine
    const riskResult = riskEngine.analyze(t);
    const aiExplanation = await aiService.analyzeTransaction(t, riskResult);

    // Update status based on decision
    if (riskResult.decision === 'block') t.status = 'blocked';
    else if (riskResult.decision === 'review') t.status = 'pending';
    else if (Math.random() < 0.05) t.status = 'failed';
    else t.status = 'completed';

    await t.save();

    const ra = new RiskAssessment({
      transactionId: t.transactionId,
      riskScore: riskResult.score,
      riskLevel: riskResult.level,
      decision: riskResult.decision,
      factors: riskResult.factors,
      aiExplanation: aiExplanation.explanation,
      aiConfidence: aiExplanation.confidence,
      analyzedAt: t.timestamp
    });
    await ra.save();

    // Create alerts for high/critical
    if (riskResult.level === 'high' || riskResult.level === 'critical') {
      const alertTypes = ['high_risk', 'velocity', 'device_anomaly', 'account_takeover'];
      const alert = new Alert({
        type: riskResult.level === 'critical' ? 'critical' : randomItem(alertTypes),
        severity: riskResult.level,
        title: `${riskResult.level.toUpperCase()} Risk Transaction Detected`,
        description: `Transaction ${t.transactionId} from ${t.customerName} flagged as ${riskResult.level} risk. Amount: ₹${t.amount.toLocaleString()}.`,
        transactionId: t.transactionId,
        customerId: t.customerId,
        status: Math.random() < 0.3 ? 'resolved' : 'active',
        createdAt: t.timestamp
      });
      await alert.save();
    }

    transactions.push(t);
  }

  // 4. Create audit log entries
  const auditActions = ['REVIEW_TRANSACTION', 'APPROVE_TRANSACTION', 'BLOCK_TRANSACTION', 'ESCALATE_ALERT', 'RESOLVE_ALERT', 'UPDATE_RULE'];
  const logs = [];
  for (let i = 0; i < 20; i++) {
    const tx = transactions[randomInt(0, Math.min(transactions.length - 1, 50))];
    logs.push({
      action: randomItem(auditActions),
      entityType: 'transaction',
      entityId: tx.transactionId,
      userId: adminUser._id,
      userName: adminUser.name,
      details: `${randomItem(auditActions).replace(/_/g, ' ').toLowerCase()} for ${tx.transactionId}`,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    });
  }
  await AuditLog.insertMany(logs);

  console.log(`\nSeeding completed successfully!`);
  console.log(`  - ${transactions.length} transactions created`);
  console.log(`  - Risk assessments generated for all transactions`);
  console.log(`  - Alerts created for high/critical transactions`);
  console.log(`  - 8 default risk rules created`);
  console.log(`  - ${logs.length} audit log entries created`);
  console.log(`  - Demo user: admin@demo.com / admin123`);
  
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  mongoose.disconnect();
  process.exit(1);
});

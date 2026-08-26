export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
}

export interface Transaction {
  _id: string;
  transactionId: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Wallet';
  merchantId: string;
  merchantName: string;
  deviceId: string;
  deviceType: string;
  location: {
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
  ipAddress: string;
  status: 'completed' | 'pending' | 'failed' | 'blocked';
  previousTransactionCount: number;
  previousFailedAttempts: number;
  accountAge: number;
  historicalAvgAmount: number;
  timestamp: string;
}

export interface RiskFactor {
  name: string;
  score: number;
  description: string;
}

export interface RiskAssessment {
  _id: string;
  transactionId: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  decision: 'approve' | 'monitor' | 'review' | 'block';
  factors: RiskFactor[];
  aiExplanation?: string;
  aiConfidence?: number;
  analyzedAt: string;
}

export interface Alert {
  _id: string;
  type: 'high_risk' | 'critical' | 'velocity' | 'account_takeover' | 'device_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  transactionId?: string;
  customerId?: string;
  status: 'active' | 'investigating' | 'resolved' | 'escalated';
  assignedTo?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface RiskRule {
  _id: string;
  ruleId: string;
  name: string;
  description: string;
  enabled: boolean;
  weight: number;
  threshold: number;
  category: string;
  lastUpdated: string;
}

export interface Investigation {
  _id: string;
  transactionId: string;
  analystId: string;
  messages: {
    role: 'analyst' | 'ai';
    content: string;
    timestamp: string;
  }[];
  status: 'open' | 'closed';
  findings?: string;
  createdAt: string;
}

export interface AuditLogEntry {
  _id: string;
  action: string;
  entityType: 'transaction' | 'alert' | 'rule' | 'investigation';
  entityId: string;
  userId: string;
  userName: string;
  details: string;
  previousValue?: any;
  newValue?: any;
  timestamp: string;
}

export interface DashboardStats {
  totalTransactions: number;
  highRisk: number;
  critical: number;
  underReview: number;
  fraudPrevented: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  recentTransactions: Transaction[];
  recentAlerts: Alert[];
}

export interface CustomerRiskProfile {
  customerId: string;
  customerName: string;
  riskScore: number;
  totalTransactions: number;
  avgAmount: number;
  knownDevices: string[];
  knownLocations: string[];
  paymentMethods: string[];
  recentTransactions: Transaction[];
  alerts: Alert[];
}

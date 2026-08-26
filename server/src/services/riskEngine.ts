import { decisionEngine } from './decisionEngine';

export interface RiskFactor {
  name: string;
  score: number;
  description: string;
}

export interface RiskResult {
  score: number;
  level: string;
  factors: RiskFactor[];
  decision: string;
}

export const riskEngine = {
  analyze(transaction: any): RiskResult {
    let score = 0;
    const factors: RiskFactor[] = [];

    // Amount Anomaly
    if (transaction.historicalAvgAmount > 0) {
      const ratio = transaction.amount / transaction.historicalAvgAmount;
      if (ratio > 5) {
        score += 30;
        factors.push({ name: 'amountAnomaly', score: 30, description: 'Amount is more than 5x historical average' });
      } else if (ratio > 3) {
        score += 20;
        factors.push({ name: 'amountAnomaly', score: 20, description: 'Amount is more than 3x historical average' });
      } else if (ratio > 2) {
        score += 10;
        factors.push({ name: 'amountAnomaly', score: 10, description: 'Amount is more than 2x historical average' });
      }
    }

    // New Device (simulated logic: if transaction has 'newDevice' flag or we randomly decide based on some hash, but let's assume it's passed or derived. For this demo, let's assume deviceType='New' or we check a flag, but since schema doesn't have newDevice boolean, let's say if previousTransactionCount == 0 it's a new device, or just a simple heuristic)
    // Actually we can add logic in seed to just trigger this. Let's look at account age and previous txns.
    // If device is not standard, or maybe we just check if it's the first time.
    // Let's add a random or fixed rule based on device id.
    if (transaction.deviceId && transaction.deviceId.startsWith('NEW_')) {
      score += 15;
      factors.push({ name: 'newDevice', score: 15, description: 'Transaction from an unrecognized device' });
    }

    // Location Anomaly
    if (transaction.location && transaction.location.city === 'Unknown') {
      score += 15;
      factors.push({ name: 'locationAnomaly', score: 15, description: 'Unusual location detected' });
    }

    // Velocity (simulated by previousTransactionCount in a short time, let's assume previousTransactionCount is hourly for this rule)
    if (transaction.previousTransactionCount > 10) {
      score += 20;
      factors.push({ name: 'velocity', score: 20, description: 'More than 10 transactions in recent period' });
    } else if (transaction.previousTransactionCount > 5) {
      score += 10;
      factors.push({ name: 'velocity', score: 10, description: 'More than 5 transactions in recent period' });
    }

    // Failed Attempts
    if (transaction.previousFailedAttempts > 5) {
      score += 15;
      factors.push({ name: 'failedAttempts', score: 15, description: 'More than 5 failed attempts recently' });
    } else if (transaction.previousFailedAttempts > 3) {
      score += 10;
      factors.push({ name: 'failedAttempts', score: 10, description: 'More than 3 failed attempts recently' });
    }

    // New Account
    if (transaction.accountAge < 7) {
      score += 10;
      factors.push({ name: 'newAccount', score: 10, description: 'Account is less than 7 days old' });
    } else if (transaction.accountAge < 30) {
      score += 5;
      factors.push({ name: 'newAccount', score: 5, description: 'Account is less than 30 days old' });
    }

    // Behavior Change (e.g. diff payment method than usual, let's just trigger if paymentMethod is 'Wallet' and amount > 50000)
    if (transaction.paymentMethod === 'Wallet' && transaction.amount > 50000) {
      score += 10;
      factors.push({ name: 'behaviorChange', score: 10, description: 'Unusual behavior pattern detected' });
    }

    score = Math.min(score, 100);

    const { level, decision } = decisionEngine.evaluate(score);

    return {
      score,
      level,
      factors,
      decision,
    };
  }
};

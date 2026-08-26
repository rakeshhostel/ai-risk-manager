import { config } from '../config';

export interface AIExplanation {
  explanation: string;
  confidence: number;
}

class MockAIProvider {
  async analyzeTransaction(transaction: any, riskResult: any): Promise<AIExplanation> {
    const factorsDesc = riskResult.factors.map((f: any) => f.description).join(', ');
    const explanation = `Based on the analysis, this transaction poses a ${riskResult.level} risk. The primary contributing factors are: ${factorsDesc || 'normal transaction patterns'}. The transaction amount is ₹${transaction.amount} from ${transaction.location?.city || 'Unknown'}.`;
    
    return {
      explanation,
      confidence: Math.floor(Math.random() * (99 - 80 + 1) + 80)
    };
  }

  async investigate(query: string, context: any): Promise<string> {
    const q = query.toLowerCase();
    
    if (q.includes('summarize') || q.includes('summary')) {
      return `Summary for ${context?.transactionId || 'the transaction'}: This transaction was flagged due to ${context?.flags?.length || 'several'} anomalies. The risk score is ${context?.riskScore || 'high'}, primarily driven by: ${context?.flags?.join(', ') || 'unusual patterns'}. I recommend manual review before approval.`;
    }
    
    if (q.includes('history') || q.includes('ip') || q.includes('past')) {
      return `Looking at the historical data for this IP address, I see 4 previous attempts in the last 24 hours. Two of those attempts were blocked due to incorrect credentials. The current login attempt appears to be part of an automated credential stuffing attack.`;
    }
    
    if (q.includes('velocity anomaly') || q.includes('velocity')) {
      return `A "Velocity Anomaly" flag is triggered when a user or device attempts an unusually high number of transactions within a short timeframe. In this case, the device initiated 5 transactions in under 2 minutes, which is 400% higher than their historical average.`;
    }
    
    if (q.includes('device') || q.includes('location')) {
      return `The transaction originated from a new device that has never been associated with this account. Furthermore, the geolocation of the IP address (Mumbai) conflicts with the user's typical location profile (Delhi), raising the risk score significantly.`;
    }

    return `Based on my analysis of ${context?.transactionId || 'this transaction'}, the requested information indicates a potential risk. The combination of amount (₹${context?.amount || 'N/A'}) and the triggered flags (${context?.flags?.join(', ') || 'none'}) suggests non-standard behavior. Please proceed with caution.`;
  }
}

export const aiService = new MockAIProvider();

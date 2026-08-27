import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Seed default localStorage data if not present
const initLocalStorage = () => {
  if (!localStorage.getItem('demodb_initialized')) {
    // 1. Rules
    const defaultRules = [
      { _id: 'r1', ruleId: 'RULE_01', name: 'Velocity Check (Hourly)', description: 'More than 5 transactions in an hour', enabled: true, weight: 15, threshold: 5, category: 'velocity', lastUpdated: new Date().toISOString() },
      { _id: 'r2', ruleId: 'RULE_02', name: 'Velocity Check (Daily)', description: 'More than 15 transactions in 24 hours', enabled: true, weight: 20, threshold: 15, category: 'velocity', lastUpdated: new Date().toISOString() },
      { _id: 'r3', ruleId: 'RULE_03', name: 'High Amount Anomaly', description: 'Transaction amount > 3x customer average', enabled: true, weight: 25, threshold: 300, category: 'amount', lastUpdated: new Date().toISOString() },
      { _id: 'r4', ruleId: 'RULE_04', name: 'Critical Amount Anomaly', description: 'Transaction amount > 5x customer average', enabled: true, weight: 35, threshold: 500, category: 'amount', lastUpdated: new Date().toISOString() },
      { _id: 'r5', ruleId: 'RULE_05', name: 'New Location Anomaly', description: 'Country conflicts with user country history', enabled: true, weight: 20, threshold: 0, category: 'location', lastUpdated: new Date().toISOString() },
      { _id: 'r6', ruleId: 'RULE_06', name: 'New Device Fingerprint', description: 'Device ID not found in customer history', enabled: true, weight: 15, threshold: 0, category: 'device', lastUpdated: new Date().toISOString() },
      { _id: 'r7', ruleId: 'RULE_07', name: 'Failed Sign-in Chain', description: 'More than 3 failed attempts before checkout', enabled: true, weight: 20, threshold: 3, category: 'access', lastUpdated: new Date().toISOString() },
      { _id: 'r8', ruleId: 'RULE_08', name: 'Risk Location Origin', description: 'Transactions from blacklisted regions', enabled: true, weight: 30, threshold: 0, category: 'location', lastUpdated: new Date().toISOString() }
    ];
    localStorage.setItem('demodb_rules', JSON.stringify(defaultRules));

    // 2. Transactions
    const methods = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'];
    const statuses = ['completed', 'completed', 'completed', 'pending', 'failed', 'blocked'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune'];
    const names = ['Amit Sharma', 'Priya Patel', 'Rahul Verma', 'Sneha Reddy', 'Vikram Singh', 'Ananya Iyer', 'Rohan Das', 'Neha Gupta'];
    
    const transactions = Array.from({ length: 50 }, (_, i) => {
      const amount = Math.floor(Math.random() * 85000) + 500;
      const status = amount > 70000 ? 'blocked' : statuses[Math.floor(Math.random() * statuses.length)];
      const customerIndex = Math.floor(Math.random() * names.length);
      return {
        _id: `t_${i}`,
        transactionId: `TXN-${100000 + i}`,
        customerId: `CUST-00${customerIndex + 1}`,
        customerName: names[customerIndex],
        amount,
        paymentMethod: methods[Math.floor(Math.random() * methods.length)],
        merchantId: `MER-${Math.floor(Math.random() * 100) + 100}`,
        merchantName: ['Amazon India', 'Flipkart', 'Zomato', 'Swiggy', 'Paytm Mall', 'Myntra'][Math.floor(Math.random() * 6)],
        deviceId: `DEV-${Math.floor(Math.random() * 50) + 50}`,
        deviceType: Math.random() > 0.4 ? 'Mobile' : 'Desktop',
        location: {
          city: cities[Math.floor(Math.random() * cities.length)],
          country: 'India',
          lat: 19.076 + (Math.random() - 0.5) * 4,
          lng: 72.877 + (Math.random() - 0.5) * 4
        },
        ipAddress: `192.168.1.${10 + i}`,
        status,
        previousTransactionCount: Math.floor(Math.random() * 50),
        previousFailedAttempts: Math.floor(Math.random() * 3),
        accountAge: Math.floor(Math.random() * 365) + 10,
        historicalAvgAmount: Math.floor(Math.random() * 15000) + 2000,
        timestamp: new Date(Date.now() - i * 45 * 60 * 1000).toISOString()
      };
    });
    localStorage.setItem('demodb_transactions', JSON.stringify(transactions));

    // 3. Alerts
    const alerts = transactions
      .filter(t => t.amount > 50000 || t.status === 'blocked')
      .map((t, idx) => ({
        _id: `a_${idx}`,
        type: t.amount > 70000 ? 'critical' : 'high_risk',
        severity: t.amount > 70000 ? 'critical' : 'high',
        title: t.amount > 70000 ? 'Critical Transaction Amount' : 'High Risk Payment Detected',
        description: `Transaction for ₹${t.amount.toLocaleString()} flagged by system security rules.`,
        transactionId: t.transactionId,
        customerId: t.customerId,
        status: t.status === 'blocked' ? 'resolved' : 'active',
        assignedTo: 'Admin User',
        createdAt: t.timestamp
      }));
    localStorage.setItem('demodb_alerts', JSON.stringify(alerts));

    // 4. Audit Log
    const auditLogs = [
      { _id: 'al1', action: 'Update Rule Settings', entityType: 'rule', entityId: 'RULE_03', userId: '1', userName: 'Admin User', details: 'Increased High Amount Anomaly weight to 25', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { _id: 'al2', action: 'Resolve Alert', entityType: 'alert', entityId: 'a_1', userId: '1', userName: 'Admin User', details: 'Reviewed and cleared transaction risk score', timestamp: new Date(Date.now() - 1800000).toISOString() }
    ];
    localStorage.setItem('demodb_auditLogs', JSON.stringify(auditLogs));

    localStorage.setItem('demodb_initialized', 'true');
  }
};

// Check if we should run in demo/offline mode
const isDemoMode = () => {
  // Offline mode is active on GitHub pages or if there is no backend running
  return window.location.hostname.includes('github.io') || 
         window.location.hostname.includes('localhost') && localStorage.getItem('demo_mode') === 'true' ||
         localStorage.getItem('demo_mode') === 'true';
};

// Auto-activate demo mode if live server is unavailable
initLocalStorage();

// Simple mock router interceptor
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (!isDemoMode()) {
    return config;
  }

  // If in demo/offline mode, intercept requests
  const url = config.url || '';
  const method = config.method || 'get';
  const data = config.data;

  // Intercept response and build a mock Axios Response
  const createMockResponse = (body: any, status = 200) => {
    return Promise.reject({
      config,
      response: {
        data: body,
        status,
        statusText: 'OK',
        headers: {},
        config
      }
    });
  };

  // Seeder helpers
  const getTransactionsList = () => JSON.parse(localStorage.getItem('demodb_transactions') || '[]');
  const getAlertsList = () => JSON.parse(localStorage.getItem('demodb_alerts') || '[]');
  const getRulesList = () => JSON.parse(localStorage.getItem('demodb_rules') || '[]');
  const getAuditList = () => JSON.parse(localStorage.getItem('demodb_auditLogs') || '[]');

  // Auth Intercepts
  if (url.includes('/auth/login')) {
    if (data.email === 'admin@demo.com' && data.password === 'admin123') {
      const mockToken = 'demo-token-' + Date.now();
      localStorage.setItem('token', mockToken);
      return createMockResponse({
        token: mockToken,
        user: { _id: '1', name: 'Admin User', email: 'admin@demo.com', role: 'admin' }
      });
    }
    return createMockResponse({ error: 'Invalid credentials' }, 401);
  }

  if (url.includes('/auth/me')) {
    if (localStorage.getItem('token')) {
      return createMockResponse({
        user: { _id: '1', name: 'Admin User', email: 'admin@demo.com', role: 'admin' }
      });
    }
    return createMockResponse({ user: null }, 401);
  }

  // Dashboard Stats Intercept
  if (url.includes('/analytics/dashboard')) {
    const txns = getTransactionsList();
    const alerts = getAlertsList();
    const totalTransactions = txns.length;
    const highRisk = alerts.filter((a: any) => a.severity === 'high').length;
    const critical = alerts.filter((a: any) => a.severity === 'critical').length;
    const underReview = alerts.filter((a: any) => a.status === 'active').length;
    const fraudPrevented = txns
      .filter((t: any) => t.status === 'blocked')
      .reduce((acc: number, curr: any) => acc + curr.amount, 0);

    return createMockResponse({
      totalTransactions,
      highRisk,
      critical,
      underReview,
      fraudPrevented,
      riskDistribution: { low: 35, medium: 10, high: highRisk, critical },
      recentTransactions: txns.slice(0, 10),
      recentAlerts: alerts.slice(0, 5)
    });
  }

  // Transactions list & queries
  if (url.includes('/transactions')) {
    const txns = getTransactionsList();
    
    // Parse single transaction if /transactions/:id
    const parts = url.split('/');
    if (parts.length > 2 && parts[parts.length - 1] !== 'transactions') {
      const id = parts[parts.length - 1];
      const match = txns.find((t: any) => t.transactionId === id || t._id === id);
      if (match) {
        // Evaluate simple risk factors for view
        const score = match.amount > 50000 ? 85 : match.amount > 20000 ? 55 : 15;
        const level = score > 80 ? 'critical' : score > 50 ? 'high' : 'low';
        return createMockResponse({
          transaction: match,
          assessment: {
            transactionId: match.transactionId,
            riskScore: score,
            riskLevel: level,
            decision: score > 80 ? 'block' : score > 50 ? 'review' : 'approve',
            factors: [
              { name: 'Amount Velocity Check', score: score * 0.6, description: 'Large transaction relative to profile average' },
              { name: 'Behavior Profile Anomaly', score: score * 0.4, description: 'Device fingerprint is not registered' }
            ],
            aiExplanation: `Based on automated feature extraction, the transaction was marked as ${level} risk. The primary trigger was an amount of ₹${match.amount.toLocaleString()} which exceeds historical benchmarks.`,
            aiConfidence: 94
          }
        });
      }
    }
    return createMockResponse(txns);
  }

  // Live Risk Analysis Simulator Intercept
  if (url.includes('/risk/analyze')) {
    // 1. Calculate dynamic score
    let score = 0;
    const factors = [];

    // Amount rules
    const amt = Number(data.amount) || 0;
    if (amt > 80000) {
      score += 55;
      factors.push({ name: 'Amount Velocity Check', score: 35, description: 'Transaction amount exceeds standard single checkout profile limits' });
    } else if (amt > 40000) {
      score += 35;
      factors.push({ name: 'Amount Velocity Check', score: 20, description: 'Transaction amount is elevated compared to historical averages' });
    } else if (amt > 15000) {
      score += 15;
      factors.push({ name: 'Amount Volatility indicator', score: 10, description: 'Slight deviation from base user transaction behavior' });
    } else {
      score += 5;
    }

    // Payment Method rules
    const methodPts = data.paymentMethod === 'Credit Card' ? 20 : 
                      data.paymentMethod === 'UPI' ? 12 : 
                      data.paymentMethod === 'Wallet' ? 8 : 
                      data.paymentMethod === 'Net Banking' ? 10 : 5;
    score += methodPts;
    factors.push({
      name: 'Payment Channel Profiler',
      score: methodPts,
      description: `Evaluated transactional risk footprint for ${data.paymentMethod} payment channel`
    });

    // Location rules
    const city = data.location?.city || 'unknown';
    let locationPts = 5;
    if (city === 'Unknown' || city === 'unknown') {
      locationPts = 25;
      factors.push({ name: 'IP Geolocation Match', score: 25, description: 'Transaction originated from a blacklisted or unresolved proxy IP' });
    } else if (city === 'Delhi') {
      locationPts = 12;
      factors.push({ name: 'IP Geolocation Match', score: 12, description: 'Location is different from user standard residential address' });
    } else if (city === 'Mumbai') {
      locationPts = 5;
      factors.push({ name: 'IP Geolocation Match', score: 5, description: 'Standard regional routing cluster validated' });
    } else {
      locationPts = 8;
      factors.push({ name: 'IP Geolocation Match', score: 8, description: 'Alternative geographic endpoint detected' });
    }
    score += locationPts;

    // Caps score at 100
    score = Math.min(score, 100);

    const level = score > 80 ? 'critical' : score > 60 ? 'high' : score > 30 ? 'medium' : 'low';
    const decision = score > 80 ? 'block' : score > 50 ? 'review' : 'approve';

    // Compile dynamic AI explanation text
    const triggers = [];
    if (amt > 40000) triggers.push(`high transaction volume (₹${amt.toLocaleString()})`);
    if (data.paymentMethod === 'Credit Card') triggers.push('elevated chargeback profiles associated with Credit Card checkouts');
    if (data.paymentMethod === 'UPI') triggers.push('velocity patterns flagged on instant UPI channels');
    if (city === 'Unknown') triggers.push('unresolved IP proxy routing indicators');

    const explanation = `A real-time evaluation was completed for transaction SIM-${Date.now()} from Customer ${data.customerId || 'CUST-1001'}. The payment channel used was ${data.paymentMethod} originating from ${city}, India. Key risk indicators verified: ${triggers.length > 0 ? triggers.join(', ') : 'no significant deviations found'}. The transaction was categorized as ${level} risk with a confidence score of 93%.`;

    return createMockResponse({
      score,
      level,
      decision,
      factors,
      aiExplanation: explanation,
      aiConfidence: 93
    });
  }

  // Alerts
  if (url.includes('/alerts')) {
    const alerts = getAlertsList();
    // Check resolve patches
    if (method === 'patch') {
      const parts = url.split('/');
      const alertId = parts[parts.length - 1];
      const updated = alerts.map((a: any) => a._id === alertId ? { ...a, status: 'resolved' } : a);
      localStorage.setItem('demodb_alerts', JSON.stringify(updated));

      // Append audit log
      const logs = getAuditList();
      const newLog = {
        _id: `al_${Date.now()}`,
        action: 'Resolve Alert',
        entityType: 'alert',
        entityId: alertId,
        userId: '1',
        userName: 'Admin User',
        details: 'Analyst manually marked alert as resolved',
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('demodb_auditLogs', JSON.stringify([newLog, ...logs]));
      return createMockResponse({ success: true });
    }
    return createMockResponse(alerts);
  }

  // Rules Engine
  if (url.includes('/rules')) {
    const rules = getRulesList();
    if (method === 'patch' || method === 'put') {
      const parts = url.split('/');
      const ruleId = parts[parts.length - 1];
      const updated = rules.map((r: any) => r._id === ruleId || r.ruleId === ruleId ? { ...r, ...data } : r);
      localStorage.setItem('demodb_rules', JSON.stringify(updated));
      return createMockResponse({ success: true });
    }
    return createMockResponse(rules);
  }

  // AI Investigator Intercept
  if (url.includes('/ai/investigate')) {
    const query = (data.query || '').toLowerCase();
    let response = `Analyst assistant: The system has verified transaction logs for account ${data.context?.transactionId || 'TX-98237'}. No significant linked clusters identified.`;

    if (query.includes('summarize') || query.includes('summary')) {
      response = `Summary for transaction ${data.context?.transactionId || 'TX-98237'}: The risk score is ${data.context?.riskScore || 89}/100. This high score is driven by two main alerts: 1. Geolocation velocity anomalies. 2. A brand-new device ID. I recommend marking this for manual validation.`;
    } else if (query.includes('history') || query.includes('ip') || query.includes('fraud')) {
      response = `Security logs for IP 192.168.1.10: I detected 3 failed login attempts prior to checkout. This specific terminal fingerprint shows a velocity of 5 API checkout triggers in under 60 seconds, which is characteristic of script-based brute forcing.`;
    } else if (query.includes('velocity')) {
      response = `The 'Velocity Anomaly' flag indicates a high frequency of operations within a short window. The cardholder profile usually does not exceed 1 payment/day, but has attempted 4 in the past 10 minutes.`;
    } else if (query.includes('device') || query.includes('location')) {
      response = `The hardware profile indicates a change (Safari on macOS, typical is Chrome on Android). Geolocation check shows origin from Mumbai, Maharashtra, which is 1,200km away from their standard billing location in Delhi.`;
    }

    return createMockResponse({ response });
  }

  // Audit Logs
  if (url.includes('/audit-logs')) {
    const logs = getAuditList();
    return createMockResponse(logs);
  }

  return config;
}, (error) => {
  // If request failed because the server was unreachable/offline, check if we should transparently fallback
  if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
    console.warn('Backend server unreachable. Switching AI Risk Manager into demo mode.');
    localStorage.setItem('demo_mode', 'true');
    window.location.reload();
  }
  return Promise.reject(error);
});

// Intercept rejected promises from the mock responses and convert them to resolved promises for our service callers
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If it was a mock response, error.response will exist and should be returned as a success
    if (error.response && isDemoMode()) {
      return Promise.resolve(error.response);
    }
    return Promise.reject(error);
  }
);

export default api;

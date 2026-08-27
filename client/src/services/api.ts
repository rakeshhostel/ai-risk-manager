import axios from 'axios';
import { useNotificationStore } from '../store/notificationStore';

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
      
      // Dispatch real-time security log
      useNotificationStore.getState().addNotification('user', '👤 Session Activated: Admin User logged in successfully.');

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

    // Dispatch real-time security alerts based on risk levels
    if (score > 60) {
      useNotificationStore.getState().addNotification('risk', `🔴 Threat Warning: Simulated txn scored ${score}/100 from ${city} via ${data.paymentMethod}!`);
    } else {
      useNotificationStore.getState().addNotification('info', `🟢 Audit Complete: Simulated txn scored ${score}/100 from ${city} via ${data.paymentMethod}.`);
    }

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

  // AI Investigator Intercept (RAG Engine & Conversational Assistant)
  if (url.includes('/ai/investigate')) {
    const query = (data.query || '').toLowerCase().trim();
    const txns = getTransactionsList();
    const alerts = getAlertsList();
    const rules = getRulesList();
    
    let response = '';

    // Helper: Find matches in text
    const findInQuery = (keywords: string[]) => keywords.some(kw => query.includes(kw.toLowerCase()));

    // 1. Dynamic Todo List / Tasks queries
    if (findInQuery(['todo', 'task', 'checklist', 'what to do', 'planner', 'schedule'])) {
      const allTasks = useNotificationStore.getState().tasks;
      const pending = allTasks.filter(t => !t.resolved);
      const resolved = allTasks.filter(t => t.resolved);

      response = `[RAG Retrieval: Planners & Checklist] 
I parsed our active system tasks. Currently, there are **${allTasks.length}** planned checklist items:

### 📋 Pending Security Tasks:
${pending.length > 0 ? pending.map((t, idx) => `*   **[ ]** \`${t.text}\` *(Scheduled: ${new Date(t.createdAt).toLocaleDateString()})*`).join('\n') : '*   None! All tasks are currently resolved.'}

### 🟢 Completed Security Tasks:
${resolved.length > 0 ? resolved.map((t, idx) => `*   **[x]** \`${t.text}\` *(Resolved by Admin)*`).join('\n') : '*   No completed tasks logged for today.'}

*AI Recommendation: Please resolve pending critical threat investigations (e.g. audit high-risk alerts) as prioritized in your console planner.*`;
    }
    // 2. Dynamic Rules queries
    else if (findInQuery(['rule', 'threshold', 'scoring weight', 'rule configuration'])) {
      const activeRules = rules.filter((r: any) => r.enabled);
      const disabledRules = rules.filter((r: any) => !r.enabled);

      response = `[RAG Retrieval: Security Rules Engine]
I audited the active rule configurations in the risk engine database:

• **Total Rules Configured**: ${rules.length}
• **Active Rules**: ${activeRules.length} enabled
• **Deactivated Rules**: ${disabledRules.length} disabled

### ⚙️ Weight Breakdown:
${activeRules.map((r: any) => `*   **${r.name}** (Category: *${r.category.toUpperCase()}*): Weight \`${r.weight}\` | Threshold \`${r.threshold}\``).join('\n')}

*AI Insight: The highest contributing factor is currently critical amount checking. You can toggle rule states in the Rule Engine sidebar to adjust real-time alert triggers.*`;
    }
    // 3. Dynamic Audit Logs queries
    else if (findInQuery(['audit log', 'action log', 'activity logs', 'what did i do', 'history logs'])) {
      const logs = getAuditList();
      response = `[RAG Retrieval: Security Audit Ledger]
Retrieving recent analyst actions from MongoDB audit collections:

• **Total Actions Recorded**: ${logs.length}
• **System Operator**: Admin User

### 📟 Recent History Trail:
${logs.slice(0, 4).map((l: any, idx: number) => `*   **[${new Date(l.timestamp).toLocaleTimeString()}]** ${l.userName} performed \`${l.action}\` on ${l.entityType} (${l.entityId}). Details: *${l.details}*`).join('\n')}

*Compliance Status: Audit trail is secured and verified under PCI-DSS logs protocols.*`;
    }
    // 4. Conversational Greetings (ChatGPT/Gemini Style)
    else if (findInQuery(['hello', 'hi', 'hey', 'how are you', 'who are you', 'greetings'])) {
      response = `Greetings! I am your AI Security Copilot, engineered with RAG capabilities and integrated directly into your payment risk platform.

I operate similarly to Gemini or ChatGPT, but with specialized clearance to query your local transaction tables, threat indicators, rules engine, and task checklists. 

**Here is what you can ask me to do:**
1. **Query Data**: "Summarize transactions for Priya Patel" or "Search alerts in Delhi".
2. **Review Agenda**: "What is my todo list for today?" or "List unresolved tasks".
3. **Auditing**: "Show active security rules" or "Retrieve audit logs".
4. **General Assistance**: I can write scripts, answer math equations, or explain security standards (e.g. PCI-DSS).

How can I assist you with your risk diagnostics today?`;
    }
    // 5. Code Writing / Scripting queries
    else if (findInQuery(['python', 'code', 'script', 'javascript', 'java', 'sql', 'program', 'write a'])) {
      response = `Certainly! I can write custom utility code to help you automate transaction scoring or export data. 

Here is a Python script to filter high-risk transactions from an API response:

\`\`\`python
import requests

API_URL = "http://localhost:5000/api/transactions"

def audit_ledger():
    try:
        response = requests.get(API_URL)
        transactions = response.json()
        
        # Filter transactions with risk score > 60
        high_risk_txns = [tx for tx in transactions if tx.get("riskScore", 0) > 60]
        
        print(f"Audited {len(transactions)} entries. Found {len(high_risk_txns)} threat markers.")
        for tx in high_risk_txns:
            print(f" - Txn: {tx['transactionId']} | Customer: {tx['customerName']} | Amount: ₹{tx['amount']}")
    except Exception as e:
        print(f"Error querying ledger database: {e}")

if __name__ == "__main__":
    audit_ledger()
\`\`\`

Let me know if you need to translate this to SQL queries or Node.js scripts!`;
    }
    // 6. Generic Knowledge Queries (Gemini-like Fallback)
    else if (findInQuery(['weather', 'capital', 'math', 'calculate', 'what is', 'explain'])) {
      // Build a smart answer based on keywords
      let answer = '';
      if (query.includes('capital')) {
        answer = "The capital of France is Paris, the capital of India is New Delhi, and the capital of Japan is Tokyo.";
      } else if (query.includes('math') || query.includes('calculate')) {
        answer = "I can perform numerical operations. My floating-point processor compiles arithmetic formulas instantaneously. Let me know which equation you want me to evaluate.";
      } else {
        answer = `I am a specialized LLM agent configured for this network console. Regarding "${data.query}", I can confirm that this request addresses general knowledge topics. My training weights include full definitions for web development, database scaling, cryptography, and network routing logs.`;
      }

      response = `[AI Universal Assistant Core]
${answer}

*System Context: I am also connected to your active risk dashboard. You can ask me to cross-reference general standards with your active ledger data by asking "what is our average transaction size" or "show active alerts".*`;
    }
    // 7. RAG Search 1: Check for customer names in query
    else {
      const namesList = ['amit', 'priya', 'rahul', 'sneha', 'vikram', 'ananya', 'rohan', 'neha'];
      const matchedName = namesList.find(n => query.includes(n));
      
      if (matchedName) {
        // RETRIEVE: Filter transactions database for customer
        const matchingTxns = txns.filter((t: any) => t.customerName.toLowerCase().includes(matchedName));
        if (matchingTxns.length > 0) {
          const totalAmt = matchingTxns.reduce((sum: number, t: any) => sum + t.amount, 0);
          const avgAmt = Math.floor(totalAmt / matchingTxns.length);
          const blockedTxns = matchingTxns.filter((t: any) => t.status === 'blocked').length;
          const matchingAlerts = alerts.filter((a: any) => matchingTxns.some((t: any) => t.transactionId === a.transactionId));
          
          response = `[RAG Retrieval Success] Retrieved ${matchingTxns.length} transaction records for customer matching "${matchedName.toUpperCase()}":
          
• Customer ID: ${matchingTxns[0].customerId}
• Total Volume: ₹${totalAmt.toLocaleString()}
• Average Amount: ₹${avgAmt.toLocaleString()}
• Status Breakdown: ${blockedTxns} blocked, ${matchingTxns.length - blockedTxns} completed.
• Linked Security Alerts: Found ${matchingAlerts.length} alert(s) in active logs.
  
  AI Assessment: The profile exhibits ${blockedTxns > 0 ? 'medium-to-high risk indicators due to previous blocked attempts. Review card token signatures.' : 'stable transaction history with no unresolved velocity anomalies.'}`;
        } else {
          response = `[RAG Retrieval empty] Searched customer directories for "${matchedName}" but found no transaction logs.`;
        }
      }
      // RAG Search 2: Specific transaction ID query
      else if (query.includes('txn-') || query.includes('sim-')) {
        const txnIdMatch = query.match(/(txn-\d+|sim-\d+)/i);
        const targetId = txnIdMatch ? txnIdMatch[0].toUpperCase() : '';
        
        // RETRIEVE: Find matching transaction document
        const txnDoc = txns.find((t: any) => t.transactionId === targetId || t.transactionId.startsWith(targetId));
        if (txnDoc) {
          const relatedAlert = alerts.find((a: any) => a.transactionId === txnDoc.transactionId);
          response = `[RAG Document Retrieved] Found transaction details for "${txnDoc.transactionId}":
          
• Cardholder: ${txnDoc.customerName} (${txnDoc.customerId})
• Amount: ₹${txnDoc.amount.toLocaleString()} via ${txnDoc.paymentMethod}
• Geolocation: ${txnDoc.location.city}, India
• Status: ${txnDoc.status.toUpperCase()}
• Alert Hook: ${relatedAlert ? `ACTIVE ALERT (Severity: ${relatedAlert.severity.toUpperCase()}, Status: ${relatedAlert.status.toUpperCase()})` : 'No active alerts linked'}
  
  AI Recommendation: The payment method is verified. ${txnDoc.amount > 50000 ? 'This transaction is flagged due to high volume limits.' : 'Risk metrics are nominal. No override is required.'}`;
        } else {
          response = `[RAG Search Error] Transaction ID "${targetId}" not found in current ledger databases.`;
        }
      }
      // RAG Search 3: Check for location queries
      else if (findInQuery(['mumbai', 'delhi', 'bangalore', 'pune', 'chennai', 'hyderabad', 'kolkata'])) {
        const cities = ['mumbai', 'delhi', 'bangalore', 'pune', 'chennai', 'hyderabad', 'kolkata'];
        const targetCity = cities.find(c => query.includes(c)) || 'mumbai';
        
        // RETRIEVE: Filter transactions originating from location
        const localTxns = txns.filter((t: any) => t.location.city.toLowerCase().includes(targetCity));
        const localBlocked = localTxns.filter((t: any) => t.status === 'blocked').length;
        response = `[RAG Location Search] Retrieved geographical transaction logs for "${targetCity.toUpperCase()}":
        
• Total transactions routed: ${localTxns.length}
• Fraud block rate: ${((localBlocked / (localTxns.length || 1)) * 100).toFixed(1)}% (${localBlocked} blocked out of ${localTxns.length} runs)
• Maximum single amount: ₹${localTxns.length > 0 ? Math.max(...localTxns.map((t: any) => t.amount)).toLocaleString() : 0}
  
  AI Assessment: Routing routes through regional proxy gateways show standard latency profiles. No active blacklisting is recommended for this node.`;
      }
      // Default fallback
      else {
        response = `[RAG System Summary] No specific customer, transaction, or location matches detected in query. Retrieved general platform metrics:
        
• Ledger Volume: ${txns.length} transactions processed
• Threat Registry: ${alerts.length} total risk alerts recorded (${alerts.filter((a: any) => a.status === 'active').length} unresolved)
• System Engine: ${rules.filter((r: any) => r.enabled).length} active security rules configured
• Global Avg Transaction Size: ₹${Math.floor(txns.reduce((acc: number, t: any) => acc + t.amount, 0) / txns.length).toLocaleString()}
  
Try asking me:
- "What is my todo list today?"
- "Explain active risk rules"
- "Show me my audit logs"
- "Summarize transactions for Priya Patel"
- "Write a python script to query transactions"`;
      }
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

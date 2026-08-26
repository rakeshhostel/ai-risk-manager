import React, { useState } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { Play, Loader2 } from 'lucide-react';
import { RiskAssessment } from '@/types';

const TransactionSimulator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null); // Use any to allow for both shapes of response
  
  const [formData, setFormData] = useState({
    customerId: 'CUST-1001',
    amount: '50000',
    paymentMethod: 'Credit Card',
    city: 'Mumbai',
    country: 'India'
  });

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const payload = {
        transactionId: `SIM-${Date.now()}`,
        customerId: formData.customerId,
        customerName: 'Test User',
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod,
        merchantId: 'M-500',
        merchantName: 'Test Merchant',
        deviceId: 'DEV-1',
        deviceType: 'Mobile',
        location: { city: formData.city, country: formData.country, lat: 0, lng: 0 },
        ipAddress: '192.168.1.1',
        timestamp: new Date().toISOString()
      };
      
      const res = await api.post('/risk/analyze', payload);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getResultDisplay = () => {
    if (!result) return null;
    const score = result.riskScore ?? result.score ?? 0;
    const level = result.riskLevel ?? result.level ?? 'unknown';
    const decision = result.decision ?? (score > 70 ? 'block' : score > 40 ? 'review' : 'approve');
    const confidence = result.aiConfidence ?? 90;
    const explanation = result.aiExplanation ?? '';

    return { score, level, decision, confidence, explanation };
  };

  const display = getResultDisplay();

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-white/10 rounded-xl p-6 shadow-xl max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-white mb-6">Real-time Risk Simulator</h2>
      
      <form onSubmit={handleSimulate} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Customer ID</label>
          <input type="text" value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})} className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">Amount (₹)</label>
          <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">Payment Method</label>
          <select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none">
            <option>UPI</option><option>Credit Card</option><option>Debit Card</option><option>Net Banking</option><option>Wallet</option>
          </select>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-gray-400 text-sm mb-2">City</label>
            <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none" />
          </div>
          <div className="flex-1">
            <label className="block text-gray-400 text-sm mb-2">Country</label>
            <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none" />
          </div>
        </div>
        
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" disabled={loading} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
            ANALYZE TRANSACTION
          </button>
        </div>
      </form>

      {display && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border-t border-white/10 pt-6">
          <h3 className="text-lg font-bold text-white mb-4">Analysis Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-white/5">
              <div className="text-gray-400 text-sm">Risk Score</div>
              <div className="text-2xl font-bold text-white">{display.score.toFixed(1)}</div>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-white/5">
              <div className="text-gray-400 text-sm">Risk Level</div>
              <div className="text-2xl font-bold text-white uppercase">{display.level}</div>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-white/5">
              <div className="text-gray-400 text-sm">Decision</div>
              <div className={`text-2xl font-bold uppercase ${display.decision === 'approve' ? 'text-green-400' : display.decision === 'block' ? 'text-red-400' : 'text-yellow-400'}`}>{display.decision}</div>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-white/5">
              <div className="text-gray-400 text-sm">AI Confidence</div>
              <div className="text-2xl font-bold text-white">{display.confidence}%</div>
            </div>
          </div>
          {display.explanation && (
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
              <div className="text-blue-400 font-medium mb-1">AI Reasoning</div>
              <p className="text-gray-300 text-sm">{display.explanation}</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default TransactionSimulator;

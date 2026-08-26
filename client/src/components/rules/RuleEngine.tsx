import React, { useState } from 'react';
import { Save, Settings2 } from 'lucide-react';
import api from '@/services/api';

const defaultRules = [
  { id: '1', name: 'Amount Anomaly', description: 'Triggers when amount exceeds historical average significantly', enabled: true, weight: 8, threshold: 50000 },
  { id: '2', name: 'New Device', description: 'Login from an unrecognized device', enabled: true, weight: 6, threshold: 1 },
  { id: '3', name: 'Location Anomaly', description: 'Transaction from high-risk country or IP distance > 500km', enabled: true, weight: 7, threshold: 500 },
  { id: '4', name: 'Velocity', description: 'High number of transactions in short timeframe', enabled: true, weight: 9, threshold: 5 },
  { id: '5', name: 'Failed Attempts', description: 'Success after multiple failed OTP/password attempts', enabled: false, weight: 5, threshold: 3 },
];

export default function RuleEngine() {
  const [rules, setRules] = useState(defaultRules);

  const updateRule = (id: string, field: string, value: any) => {
    setRules(rules.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const saveRule = async (id: string) => {
    const rule = rules.find(r => r.id === id);
    if (!rule) return;
    try {
      // Mock API
      // await api.patch(`/rules/${id}`, rule);
      alert(`Saved rule: ${rule.name}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-4 text-white">
      {rules.map(rule => (
        <div key={rule.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-semibold text-lg">{rule.name}</h3>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${rule.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {rule.enabled ? 'ACTIVE' : 'DISABLED'}
              </span>
            </div>
            <p className="text-sm text-gray-400">{rule.description}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 w-full md:w-auto bg-black/20 p-3 rounded-lg border border-white/5">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Status</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={rule.enabled} onChange={(e) => updateRule(rule.id, 'enabled', e.target.checked)} />
                <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Risk Weight (1-10)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="range" min="1" max="10" 
                  value={rule.weight} 
                  onChange={(e) => updateRule(rule.id, 'weight', parseInt(e.target.value))}
                  className="w-24 accent-cyan-500"
                />
                <span className="text-sm font-mono">{rule.weight}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Threshold</label>
              <input 
                type="number" 
                value={rule.threshold}
                onChange={(e) => updateRule(rule.id, 'threshold', parseInt(e.target.value))}
                className="w-20 bg-black/50 border border-white/10 rounded px-2 py-1 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button 
              onClick={() => saveRule(rule.id)}
              className="ml-auto md:ml-0 p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center"
              title="Save changes"
            >
              <Save size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

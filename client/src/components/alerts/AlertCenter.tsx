import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, ShieldAlert, XCircle, Clock } from 'lucide-react';
import api from '@/services/api';

const mockAlerts = [
  { id: '1', title: 'High Velocity Transfer', severity: 'critical', status: 'open', time: '10 mins ago', amount: '₹1,50,000' },
  { id: '2', title: 'Suspicious Login Location', severity: 'high', status: 'open', time: '25 mins ago', amount: null },
  { id: '3', title: 'Multiple Failed Attempts', severity: 'medium', status: 'investigating', time: '1 hour ago', amount: null },
  { id: '4', title: 'Unusual Device Pattern', severity: 'low', status: 'resolved', time: '3 hours ago', amount: '₹5,000' },
];

export default function AlertCenter() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState('all');

  const updateStatus = async (id: string, status: string) => {
    try {
      // Mock API call
      // await api.patch(`/alerts/${id}`, { status });
      setAlerts(alerts.map(a => a.id === id ? { ...a, status } : a));
    } catch (e) {
      console.error(e);
      setAlerts(alerts.map(a => a.id === id ? { ...a, status } : a));
    }
  };

  const filtered = alerts.filter(a => filter === 'all' || a.status === filter);

  const getSeverityColor = (sev: string) => {
    switch(sev) {
      case 'critical': return 'border-red-500/50 bg-red-500/10 text-red-400';
      case 'high': return 'border-orange-500/50 bg-orange-500/10 text-orange-400';
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400';
      case 'low': return 'border-green-500/50 bg-green-500/10 text-green-400';
      default: return 'border-gray-500/50 bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 text-white">
      <div className="flex gap-4 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
        <div className="flex-1 text-center border-r border-white/10">
          <div className="text-3xl font-bold text-red-400">{alerts.filter(a => a.severity === 'critical' && a.status === 'open').length}</div>
          <div className="text-sm text-gray-400">Critical Open</div>
        </div>
        <div className="flex-1 text-center border-r border-white/10">
          <div className="text-3xl font-bold text-orange-400">{alerts.filter(a => a.severity === 'high' && a.status === 'open').length}</div>
          <div className="text-sm text-gray-400">High Open</div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-3xl font-bold text-blue-400">{alerts.filter(a => a.status === 'investigating').length}</div>
          <div className="text-sm text-gray-400">In Progress</div>
        </div>
      </div>

      <div className="flex gap-2 mb-2">
        {['all', 'open', 'investigating', 'resolved'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${filter === f ? 'bg-cyan-600 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map(alert => (
          <div key={alert.id} className={`p-5 rounded-xl border ${getSeverityColor(alert.severity)} flex flex-col gap-4 relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
              <ShieldAlert size={48} />
            </div>
            <div>
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-lg">{alert.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wider ${
                  alert.status === 'open' ? 'bg-red-500/20 text-red-300' : 
                  alert.status === 'investigating' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'
                }`}>{alert.status}</span>
              </div>
              <div className="flex items-center gap-4 text-sm opacity-80 mt-2">
                <span className="flex items-center gap-1"><Clock size={14} /> {alert.time}</span>
                {alert.amount && <span className="font-mono bg-black/30 px-2 py-0.5 rounded">{alert.amount}</span>}
              </div>
            </div>
            
            <div className="flex gap-2 mt-auto pt-4 border-t border-current/20">
              {alert.status === 'open' && (
                <button onClick={() => updateStatus(alert.id, 'investigating')} className="flex-1 flex items-center justify-center gap-2 py-2 bg-black/20 hover:bg-black/40 rounded-lg text-sm transition-colors">
                  <AlertCircle size={16} /> Investigate
                </button>
              )}
              {alert.status === 'investigating' && (
                <button onClick={() => updateStatus(alert.id, 'resolved')} className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg text-sm transition-colors">
                  <CheckCircle size={16} /> Resolve
                </button>
              )}
              {alert.status !== 'resolved' && (
                <button className="px-3 flex items-center justify-center py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-colors">
                  <XCircle size={16} /> Block
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

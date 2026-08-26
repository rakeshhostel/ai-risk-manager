import React, { useState, useEffect } from 'react';
import { FileText, Search } from 'lucide-react';

const mockLogs = [
  { id: 'L1', timestamp: '2026-08-24 10:30:12', user: 'System', action: 'RULE_TRIGGER', entity: 'TX-9912', details: 'Velocity rule triggered. Score: 85' },
  { id: 'L2', timestamp: '2026-08-24 10:35:05', user: 'ajay.k@fintech.com', action: 'ALERT_STATUS_CHANGE', entity: 'ALERT-450', details: 'Status changed to Investigating' },
  { id: 'L3', timestamp: '2026-08-24 11:02:44', user: 'AI Investigator', action: 'ANALYSIS_COMPLETE', entity: 'TX-9912', details: 'Identified credential stuffing pattern' },
  { id: 'L4', timestamp: '2026-08-24 11:15:20', user: 'admin', action: 'RULE_UPDATE', entity: 'RULE-1', details: 'Changed threshold to 50000' },
  { id: 'L5', timestamp: '2026-08-24 12:45:00', user: 'System', action: 'USER_BLOCK', entity: 'USER-1029', details: 'Exceeded critical risk threshold' },
];

export default function AuditLog() {
  const [logs, setLogs] = useState(mockLogs);
  const [search, setSearch] = useState('');

  const filtered = logs.filter(l => 
    l.action.toLowerCase().includes(search.toLowerCase()) || 
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.entity.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden flex flex-col h-full text-white">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search logs..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-cyan-500 w-64"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
          <FileText size={16} /> Export CSV
        </button>
      </div>
      
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-gray-400 font-medium">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">User/System</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Entity ID</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map(log => (
              <tr key={log.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-mono text-gray-400">{log.timestamp}</td>
                <td className="px-4 py-3">{log.user}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-white/10 rounded text-xs tracking-wider">{log.action}</span>
                </td>
                <td className="px-4 py-3 font-mono text-cyan-400">{log.entity}</td>
                <td className="px-4 py-3 text-gray-300">{log.details}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No logs found matching search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

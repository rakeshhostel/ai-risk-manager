import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';

interface Filters {
  search: string;
  riskLevel: string;
  status: string;
}

interface Props {
  onFilterChange: (filters: Filters) => void;
}

const TransactionFilters: React.FC<Props> = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange({ search, riskLevel, status });
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search, riskLevel, status, onFilterChange]);

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-white/10 rounded-xl p-4 mb-6 shadow-lg flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search by ID or Customer..."
          className="w-full bg-gray-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="flex gap-4 w-full md:w-auto">
        <div className="relative flex-1 md:w-48">
          <select 
            className="w-full appearance-none bg-gray-900/50 border border-white/10 rounded-lg pl-4 pr-10 py-2 text-white focus:outline-none focus:border-cyan-500"
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
          >
            <option value="">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
            <option value="critical">Critical Risk</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>

        <div className="relative flex-1 md:w-48">
          <select 
            className="w-full appearance-none bg-gray-900/50 border border-white/10 rounded-lg pl-4 pr-10 py-2 text-white focus:outline-none focus:border-cyan-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="blocked">Blocked</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;

import React from 'react';
import { Transaction, RiskAssessment } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';

interface TransactionTableProps {
  transactions: Transaction[];
  assessments: Record<string, RiskAssessment>;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, assessments }) => {
  const navigate = useNavigate();
  const { setSelectedTransaction } = useNotificationStore();

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-white/10 rounded-xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="text-xs uppercase bg-gray-900/50 text-gray-400 border-b border-white/10">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Risk Level</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4 text-center">AI Copilot</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const assessment = assessments[tx.transactionId];
              const riskLevel = assessment?.riskLevel || 'unknown';
              
              return (
                <tr 
                  key={tx._id} 
                  onClick={() => navigate(`/transactions/${tx.transactionId}`)}
                  className="border-b border-white/5 hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 font-mono text-xs">{tx.transactionId}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{tx.customerName}</div>
                    <div className="text-xs text-gray-500">{tx.customerId}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-white">₹{tx.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">{tx.paymentMethod}</td>
                  <td className="px-6 py-4">{tx.location.city}, {tx.location.country}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getRiskBadge(riskLevel)} uppercase`}>
                      {riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => {
                        setSelectedTransaction({
                          ...tx,
                          riskScore: assessment?.riskScore ?? assessment?.score ?? 15,
                          flags: assessment?.factors?.map(f => f.name) ?? ['Profile verification required']
                        });
                      }}
                      className="p-1.5 bg-secondary/15 hover:bg-secondary/25 border border-secondary/20 hover:border-secondary/40 rounded-xl text-secondary transition-all hover:scale-[1.08] active:scale-[0.92]"
                      title="Consult AI Copilot"
                    >
                      <Bot size={14} className="animate-pulse" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  No transactions found matching the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;

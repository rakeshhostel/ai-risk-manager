import React from 'react';
import { Transaction } from '@/types';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActivityFeedProps {
  transactions: Transaction[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-green-400';
    case 'pending': return 'text-yellow-400';
    case 'failed': return 'text-gray-400';
    case 'blocked': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ transactions }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-white/10 rounded-xl p-6 shadow-xl h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {transactions.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No recent activity.</div>
        ) : (
          transactions.map((tx, idx) => (
            <motion.div 
              key={tx._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => navigate(`/transactions/${tx._id}`)}
              className="p-3 rounded-lg border border-white/5 bg-gray-900/40 hover:bg-gray-800 transition-colors cursor-pointer flex justify-between items-center group"
            >
              <div>
                <div className="text-white text-sm font-medium">{tx.customerName}</div>
                <div className="text-gray-400 text-xs mt-0.5">{tx.transactionId}</div>
              </div>
              <div className="text-right flex items-center gap-4">
                <div>
                  <div className="text-white text-sm font-bold">₹{tx.amount.toLocaleString()}</div>
                  <div className={`text-xs mt-0.5 capitalize ${getStatusColor(tx.status)}`}>{tx.status}</div>
                </div>
                <ArrowRight size={16} className="text-gray-600 group-hover:text-cyan-400 transition-colors" />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;

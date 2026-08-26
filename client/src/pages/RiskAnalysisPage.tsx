import React from 'react';
import { motion } from 'framer-motion';
import TransactionSimulator from '../components/transactions/TransactionSimulator';

export const RiskAnalysisPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Risk Analysis</h1>
        <p className="text-gray-400 text-sm mt-1">Simulate and analyze transaction risk</p>
      </div>
      <TransactionSimulator />
    </motion.div>
  );
};
